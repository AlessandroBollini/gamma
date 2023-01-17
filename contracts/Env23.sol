// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Env23 is ERC721, ERC721URIStorage {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
 
    string[] IpfsUri = [
        "https://ipfs.io/ipfs/QmeRf1jEZenWTMyXUsrqtzLhuT59QMDQBH46LFbQ7hvjvY",
        "https://ipfs.io/ipfs/QmaL8hiCsnMuNKWuwwqPtdGWPCfvY8UfumZPXUDttsSyyq",
        "https://ipfs.io/ipfs/QmdYTqUAhvEW7itYHGtbtSrDWsSp1WDfr2tPaYqFSs4hY2"
    ]; 

    constructor() ERC721("Env23", "E23") {}

    function performUpkeep(uint256 _tokenId,uint256 _level) external {
            levelUp(_tokenId,_level);
    }
    
    function safeMint(address to,uint256 _level) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, IpfsUri[_level]);
    }

    //levelUp the NFT by one 
    function levelUp(uint256 _tokenId,uint256 _level) public {
        if(nftStage(_tokenId) >= 2){return;}
        uint256 newVal = _level;
        string memory newUri = IpfsUri[newVal];
        _setTokenURI(_tokenId, newUri);
    }

    // determin the stage of the NFT
    function nftStage(uint256 _tokenId) public view returns (uint256) {
        string memory _uri = tokenURI(_tokenId);
        if (compareStrings(_uri, IpfsUri[0])) {
            return 0;
        }
        if (
            compareStrings(_uri, IpfsUri[1]) 
        ) {
            return 1;
        }
        return 2;
    }

    function compareStrings(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}