// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "../../contracts/Dex1.sol";

contract SetupContract is Dex {

    event Debug(uint256 b1, uint256 b2, uint256 b3, uint256 b4);

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
        super.swap(token1, token2, amount);
        check();
    }

    function swap2(uint amount) public {
        super.swap(token2, token1, amount);
        check();
    }

    function check() internal {
        uint b1 = balanceOf(token1, address(this));
        uint b2 = balanceOf(token2, address(this));
        uint b3 = balanceOf(token1, address(player));
        uint b4 = balanceOf(token2, address(player));
        emit Debug(b1, b2, b3, b4);

        assert(balanceOf(token1, address(this)) >= 85);
        assert(balanceOf(token2, address(this)) >= 85);
    }
}
