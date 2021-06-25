// Create a user tracking dapp. Build a system for tracking who is on their nice list and 
// who is on their naughty list. Allow for people to pay a fee to get themselves off of the 
// naughty list. Let users on the nice list earn a portion of the fees based on how many 
// other people are on the nice list.

pragma solidity 0.8.0;


contract SantasList {
    
    mapping(address => uint) public niceFees;
    
    uint public fee;
    
    address public santa;
    
    struct Person {
        string _name;
        address _address;
    }
    
    Person[] niceList;
    Person[] naughtyList;

    event Nice(string _name, address _address);
    event Naughty(string _name, address _address);
    event getnice(string _name, address _address, uint _feePerNice);
    event cashout(address _address, uint _fee);


    
    constructor() {
        santa = msg.sender;
        fee = 1 * 1 ether;
        
    }
    
    function nice(string memory _name, address _address) public {
        require(msg.sender == santa);
        require(_address != address(0));
        niceList.push(Person(_name, _address));
        emit Nice(_name, _address);
    }
    function naughty(string memory _name, address _address) public {
        require(msg.sender == santa);
        require(_address != address(0));
        naughtyList.push(Person(_name, _address));
        emit Naughty(_name, _address);

        
    }
    
    function getNice(string memory _name) public payable {
        require(msg.value == fee);
        uint feePerNice = msg.value / niceList.length;
        address _address;
        for (uint i=0; i<niceList.length; i++) {
            address address_ = niceList[i]._address;
            niceFees[address_] += feePerNice;
        }
        for (uint i=0; i<naughtyList.length; i++) {
            string memory name_ = naughtyList[i]._name;
            if (keccak256(bytes(name_)) == keccak256(bytes(_name))) {
                 _address = naughtyList[i]._address;
                niceList.push(Person(_name, _address));
                uint _index = i;
                for(i=_index; i<naughtyList.length -1; i++) {
                    naughtyList[i] = naughtyList[i+1];
                    
                }
                naughtyList.pop();
            }
            
        }
        emit getnice(_name, _address, feePerNice);
    } 

    
    function cashOut() public {
        uint amount = niceFees[msg.sender];
        niceFees[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit cashout(msg.sender, amount);
    }
    
    function NiceList() public view returns (string[] memory){
        // uint _niceLength = niceList.length -1;
        string[] memory _niceList = new string[](niceList.length);

        for(uint i = 0; i < niceList.length; i++) {
            _niceList[i] = niceList[i]._name;
        }

        return _niceList;
    }
    
    function NaughtyList() public view returns (string[] memory){
        // uint _niceLength = niceList.length -1;
        string[] memory _naughtyList = new string[](naughtyList.length);
        
        for(uint i = 0; i < naughtyList.length; i++) {
            _naughtyList[i] = naughtyList[i]._name;
        }
        
        return _naughtyList;
    }
}