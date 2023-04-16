// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "../../contracts/Dex1.sol";

contract SetupContract is Dex {

    address player;
    SwappableToken swapToken1;
    SwappableToken swapToken2;

    constructor() {
        player = msg.sender;
        swapToken1 = new SwappableToken(address(this), "token1", "TK1", 110);
        swapToken2 = new SwappableToken(address(this), "token2", "TK2", 110);

        swapToken1.transfer(player, 10);
        swapToken2.transfer(player, 10);

        setTokens(address(swapToken1), address(swapToken2));
        renounceOwnership();
    }

    function swap1(uint amount) public {
        super.swap(address(swapToken1), address(swapToken2), amount);

        assert(balanceOf(address(swapToken1), address(this)) > 10);
        assert(balanceOf(address(swapToken2), address(this)) > 10);
    }

    function swap2(uint amount) public {
        super.swap(address(swapToken2), address(swapToken1), amount);

        assert(balanceOf(address(swapToken1), address(this)) > 10);
        assert(balanceOf(address(swapToken2), address(this)) > 10);
    }
}
