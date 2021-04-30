pragma solidity ^0.5.0;

import './ERC721.sol';
import './ERC165.sol';
import './SafeMath.sol';
import './Address.sol';
import './Strings.sol';

contract CreateToken is ERC721, ERC165 {
    using SafeMath for uint256;
    using Address for address;

    address payable public owner;
    mapping(bytes4 => bool) supportedInterfaces;

    mapping(uint256 => address) tokenOwners; //소유자 정보를 담는 데이터
    mapping(address => uint256) balances; //특정 소유계정이 가진 토큰의 수
    mapping(uint256 => address) allowance; //어떤 토큰 아이디를 어떤 계정이 소유권을 이전 할 수 있는 권한을 갖고 있는가
    //제3자가 승인을할 수 있게 함.
    mapping(address => mapping(address => bool)) operators; //어떤 소유자 계정이 중계 계정, 앞 address -> 소유자
    //2번쨰 address -> 중계인 계정

    mapping(uint256 => string) tokenURIs;

    struct asset {
        string ipfsHash;
    }

    //asset[] 이미지 조합 , hash 값들이 들어가 있음.
    asset[] public allTokens;

    //for enumeration
    uint256[] public allValidTokenIds; //유효한 토큰 id만 갖고 있는 배열
    mapping(uint256 => uint256) private allValidTokenIndex;
    //토큰 id만 가지고 인데스를 반환

    modifier onlyOwner {
        require(msg.sender == owner, 'Only owner can call this function.');
        _;
    }

    constructor() public {
        owner = msg.sender;
        supportedInterfaces[0x01ffc9a7] = true; //ERC165
        supportedInterfaces[0x80ac58cd] = true; //ERC721
        supportedInterfaces[0x5b5e139f] = true; //ERC721Metadata
    }

    //ERC 165 구현
    function supportsInterface(bytes4 interfaceID) external view returns (bool) {
        return supportedInterfaces[interfaceID];
    }

    //토큰 소유 계정을 key로 해서 값을 리턴 총 토큰 수
    function balanceOf(address _owner) external view returns (uint256) {
        require(_owner != address(0));
        return balances[_owner];
    }

    //토큰 id를 받아서 토큰 id 를 토큰 Owner에 넣어서 리턴.
    function ownerOf(uint256 _tokenId) public view returns (address) {
        address addr_owner = tokenOwners[_tokenId];
        require(addr_owner != address(0), 'Token is invalid'); //소유자가 0이라면 예외처리
        return addr_owner;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public payable {
        address addr_owner = ownerOf(_tokenId);

        //토큰 계정이랑 from 계정이 일치하는지 확인.
        require(addr_owner == _from, '_from is NOT the owner of the token');
        //to 계정은 null이면 안됨
        require(_to != address(0), 'Transfer _to address 0x0');

        //allowance 게정도 가능. transferfrom 함수를호출 가능 , 즉 alloowance 계정인지.
        address addr_allowed = allowance[_tokenId];
        bool isOp = operators[addr_owner][msg.sender]; //operators(중계인 계정들)이 msg.sender에게 승인을 했는지?

        require(addr_owner == msg.sender || addr_allowed == msg.sender || isOp, 'msg.sender does not have transferable token');
        //위 조건들이 반영되면 시작.
        // 토큰주인을 _to 계정으로 변경.
        //밸런스(_프롬)[토큰 수 -1]
        //밸런스(_to)[토큰수 + 1]
        tokenOwners[_tokenId] = _to;
        balances[_from] = balances[_from].sub(1);
        balances[_to] = balances[_to].add(1);

        //소유계정이 바꼈기 때문에 delete를 해준다.
        if (allowance[_tokenId] != address(0)) {
            delete allowance[_tokenId];
        }

        emit Transfer(_from, _to, _tokenId);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory data
    ) public payable {
        transferFrom(_from, _to, _tokenId);

        //check if _to is CA
        if (_to.isContract()) {
            bytes4 result = ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, data);

            require(result == bytes4(keccak256('onERC721Received(address,address,uint256,bytes)')), 'receipt of token is NOT completed');
        }
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public payable {
        safeTransferFrom(_from, _to, _tokenId, '');
    }

    // 소유권 이전?
    function approve(address _approved, uint256 _tokenId) external payable {
        address addr_owner = ownerOf(_tokenId);
        bool isOp = operators[addr_owner][msg.sender];

        require(addr_owner == msg.sender || isOp, 'Not approved by owner');

        allowance[_tokenId] = _approved;

        emit Approval(addr_owner, _approved, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        operators[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        return allowance[_tokenId];
    }

    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return operators[_owner][_operator];
    }

    //

    //non-ERC721 standard
    //
    //

    function mint(address account, string calldata ipfsHash) external payable returns (uint256) {
        asset memory newAsset = asset(ipfsHash);

        //allTokens.push(newAsset) - 1; 이거를 토큰 id로 하기로 했음.

        uint256 tokenId = allTokens.push(newAsset) - 1;
        //token id starts from 0, index of assets array

        //아 토큰 id로 토큰오너스 라느 곳에 account에 보내줌.
        tokenOwners[tokenId] = account;
        balances[account] = balances[account].add(1);

        //for enumeration
        //인덱스를 저장 함. 유효한 토큰만 저장함.
        allValidTokenIndex[tokenId] = allValidTokenIds.length;
        //index starts from 0
        allValidTokenIds.push(tokenId);

        //Token Metadata
        tokenURIs[tokenId] = Strings.strConcat(baseTokenURI(), ipfsHash);

        //실제 계정으로 토큰을 보내줌 .
        emit Transfer(address(0), account, tokenId);
    }

    function burn(uint256 _tokenId) external {
        address addr_owner = ownerOf(_tokenId);

        require(addr_owner == msg.sender, 'msg.sender is NOT the owner of the token');

        //reset approved address
        if (allowance[_tokenId] != address(0)) {
            delete allowance[_tokenId];
            // tokenId => 0
        }

        //transfer : change the owner of the token, but address(0)
        tokenOwners[_tokenId] = address(0);
        balances[msg.sender] = balances[msg.sender].sub(1);

        //for enumeration
        removeInvalidToken(_tokenId);

        //clear metadata if exists
        if (bytes(tokenURIs[_tokenId]).length != 0) {
            delete tokenURIs[_tokenId];
        }

        emit Transfer(addr_owner, address(0), _tokenId);
    }

    function removeInvalidToken(uint256 tokenIdToRemove) private {
        uint256 lastIndex = allValidTokenIds.length.sub(1);
        uint256 removeIndex = allValidTokenIndex[tokenIdToRemove];

        uint256 lastTokenId = allValidTokenIds[lastIndex];

        //swap
        allValidTokenIds[removeIndex] = lastTokenId;
        allValidTokenIndex[lastTokenId] = removeIndex;

        //delete
        //Arrays have a length member to hold their number of elements.
        //Dynamic arrays can be resized in storage (not in memory) by changing the .length member.
        allValidTokenIds.length = allValidTokenIds.length.sub(1);
        //allValidTokenIndex is private so can't access invalid token by index programmatically
        allValidTokenIndex[tokenIdToRemove] = 0;
    }

    function baseTokenURI() public pure returns (string memory) {
        return 'https://gateway.ipfs.io/ipfs/';
    }

    //ERC721Enumerable
    function totalSupply() public view returns (uint256) {
        return allValidTokenIds.length;
    }

    //ERC721Enumerable
    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(index < totalSupply());
        return allValidTokenIds[index];
    }

    //ERC721Metadata
    function name() external pure returns (string memory) {
        return 'IPFS TOKEN';
    }

    //ERC721Metadata
    function symbol() external pure returns (string memory) {
        return 'IPT';
    }

    //ERC721Metadata
    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        require(tokenByIndex(allValidTokenIndex[_tokenId]) == _tokenId, 'The token is invalid');
        return tokenURIs[_tokenId];
    }

    function kill() external onlyOwner {
        selfdestruct(owner);
    }

    // //custom
    // function alltoken() external view returns (*) {
    //     return allTokens;
    // }
}

contract ERC721TokenReceiver {
    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes memory _data
    ) public returns (bytes4);
}
