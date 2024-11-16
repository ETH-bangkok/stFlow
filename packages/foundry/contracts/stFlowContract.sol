// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { BaseHook } from "v4-periphery/src/base/hooks/BaseHook.sol";
import { Currency } from "v4-core/src/types/Currency.sol";
import { Hooks } from "v4-core/src/libraries/Hooks.sol";
import { IPoolManager } from "v4-core/src/interfaces/IPoolManager.sol";
import { PoolKey } from "v4-core/src/types/PoolKey.sol";
import { PoolId, PoolIdLibrary } from "v4-core/src/types/PoolId.sol";
import { BalanceDelta } from "v4-core/src/types/BalanceDelta.sol";
import {
  BeforeSwapDelta,
  BeforeSwapDeltaLibrary,
  toBeforeSwapDelta
} from "v4-core/src/types/BeforeSwapDelta.sol";
import { IERC20 } from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "v3-periphery/contracts/libraries/TransferHelper.sol";
import { ISwapRouter } from "v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface Lido {
  function wrap(uint256 _stETHAmount) external returns (uint256);
}

interface WETH {
  function deposit() external payable;
  function withdraw(uint256 wad) external;
}

contract StFlowHook is BaseHook {
  using PoolIdLibrary for PoolKey;

  Lido steth_wrapper;
  address immutable wsteth;
  ISwapRouter immutable v3_swapRouter;
  WETH immutable weth;

  // NOTE: ---------------------------------------------------------
  // state variables should typically be unique to a pool
  // a single hook contract should be able to service multiple pools
  // ---------------------------------------------------------------

  mapping(PoolId => uint256 count) public beforeSwapCount;
  mapping(PoolId => uint256 count) public afterSwapCount;

  mapping(PoolId => uint256 count) public beforeAddLiquidityCount;
  mapping(PoolId => uint256 count) public beforeRemoveLiquidityCount;

  constructor(
    IPoolManager _poolManager,
    Lido steth_wrapper_,
    address wsteth_,
    ISwapRouter v3_swapRouter_,
    WETH weth_contract
  ) BaseHook(_poolManager) {
    steth_wrapper = steth_wrapper_;
    wsteth = wsteth_;
    v3_swapRouter = v3_swapRouter_;
    weth = weth_contract;
  }

  function getHookPermissions()
    public
    pure
    override
    returns (Hooks.Permissions memory)
  {
    return Hooks.Permissions({
      beforeInitialize: false,
      afterInitialize: false,
      beforeAddLiquidity: false,
      afterAddLiquidity: false,
      beforeRemoveLiquidity: false,
      afterRemoveLiquidity: false,
      beforeSwap: true,
      afterSwap: false,
      beforeDonate: false,
      afterDonate: false,
      beforeSwapReturnDelta: true,
      afterSwapReturnDelta: false,
      afterAddLiquidityReturnDelta: false,
      afterRemoveLiquidityReturnDelta: false
    });
  }

  // -----------------------------------------------
  // NOTE: see IHooks.sol for function documentation
  // -----------------------------------------------

  function beforeSwap(
    address,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    bytes calldata
  ) external override returns (bytes4, BeforeSwapDelta, uint24) {
    BeforeSwapDelta beforeSwapDelta;

    if (!params.zeroForOne) {
      //Steth for ETH
      //go to lido, swap all the steth tokens with wsteth

      uint256 amountInOutPositive = params.amountSpecified > 0
        ? uint256(params.amountSpecified)
        : uint256(-params.amountSpecified);

      poolManager.take(key.currency0, address(this), amountInOutPositive);

      IERC20(Currency.unwrap(key.currency0)).approve(
        address(steth_wrapper), amountInOutPositive
      );

      steth_wrapper.wrap(amountInOutPositive);

      TransferHelper.safeApprove(
        wsteth, address(v3_swapRouter), amountInOutPositive
      );

      ISwapRouter.ExactInputSingleParams memory swap_params = ISwapRouter
        .ExactInputSingleParams({
        tokenIn: wsteth,
        tokenOut: address(0),
        fee: 500, //edit: fee
        recipient: address(this),
        deadline: block.timestamp,
        amountIn: amountInOutPositive,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      });

      uint256 amountOut = v3_swapRouter.exactInputSingle(swap_params);

      weth.withdraw(amountOut);

      beforeSwapDelta = toBeforeSwapDelta(
        int128(-params.amountSpecified), // So `specifiedAmount` = +100
        int128(-int128(uint128(amountOut))) // Unspecified amount (output delta) = -100
      );

      poolManager.settle();
    } else {
      //Eth for Steth
    }

    return (this.beforeSwap.selector, beforeSwapDelta, 0);
  }
}
