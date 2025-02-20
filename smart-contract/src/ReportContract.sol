// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ReportContract {
    
    mapping (address => bool) private owners;
    mapping(string => bool) private threatTypesMapping;
    string[]  private  threatTypesArray = ["Scammer","Phishing","Honeypot"];   

    mapping (address => Report[]) private reports;
 
    struct Report {
        string[] threats;
        string description; 
        address reporter;       
        uint256 timestamp;
    }

    constructor(address[] memory _owners) {
        require(_owners.length > 0, "At least one owner required");
        for (uint i = 0; i < _owners.length; i++) {
            owners[_owners[i]] = true;
        }
        for(uint i = 0; i <threatTypesArray.length;i++){
            threatTypesMapping[threatTypesArray[i]]=true;
        }
    }

    modifier onlyOwners() {
        require(owners[msg.sender], "Not an owner");
        _;
    }

    function addOwner(address _newOwner) public onlyOwners {
        require(!owners[_newOwner], "Already an owner");
        owners[_newOwner] = true;        
    }

    function removeOwner(address _owner) public onlyOwners {
        require(owners[_owner], "Not an owner");
        require(msg.sender!=_owner,"You cant remove yourself");
        owners[_owner] = false;        
    }
   
    function addThreatType(string memory newThreatType) public onlyOwners {
      require(!threatTypesMapping[newThreatType],  "Already an existing");
      threatTypesMapping[newThreatType] = true;
      threatTypesArray.push(newThreatType);
    } 

    function getThreatTypes() external view returns(string[] memory){
      return threatTypesArray;
    }
    
    function report(address _address,string[] memory _threats,string memory _description) external {
      for(uint i=0;i<reports[_address].length;i++){
        require((msg.sender==reports[_address][i].reporter), "You Have Already Reported");
      }   
      Report memory newReport = Report({
        threats:_threats,
        description: _description,
        reporter: msg.sender,
        timestamp: block.timestamp       
      });
    reports[_address].push(newReport);
    }

    function getReports(address _address) external view returns (Report[] memory){
        return reports[_address];
    }
}
