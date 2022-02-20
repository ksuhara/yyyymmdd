//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "./Base64.sol";
import {BokkyPooBahsDateTimeLibrary} from "./BokkyPooBahsDateTimeLibrary.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract YYYYMMDD is ERC721, Ownable {
  using Strings for uint256;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

  function mint(uint256 tokenId) public {
    require(BokkyPooBahsDateTimeLibrary.addDays(0, tokenId - 1) < block.timestamp);
    _safeMint(msg.sender, tokenId);
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    uint256 tokenTimeStamp = BokkyPooBahsDateTimeLibrary.addDays(0, tokenId - 1);
    string[5] memory parts;
    parts[
      0
    ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 36px; }</style><rect width="100%" height="100%" fill="black" /><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" class="base">';

    parts[1] = BokkyPooBahsDateTimeLibrary.getYear(tokenTimeStamp).toString();
    parts[2] = toISOMonthAndDate(BokkyPooBahsDateTimeLibrary.getMonth(tokenTimeStamp));
    parts[3] = toISOMonthAndDate(BokkyPooBahsDateTimeLibrary.getDay(tokenTimeStamp));
    parts[4] = "</text></svg>";

    string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4]));

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "YYYYMMDD #',
            tokenId.toString(),
            '", "description": "YYYYMMDD is timestamp token. Feel free to use YYYYMMDD in any way you want.", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(output)),
            '"}'
          )
        )
      )
    );
    output = string(abi.encodePacked("data:application/json;base64,", json));

    return output;
  }

  function toISOMonthAndDate(uint256 num) public pure returns (string memory) {
    if (num >= 10) {
      return num.toString();
    } else {
      return string(abi.encodePacked("0", num.toString()));
    }
  }
}
