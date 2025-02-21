/ SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
contract ReportContract {
    mapping(address => bool) private owners;
    mapping(string => bool) private threatTypesMapping;
    string[] private threatTypesArray = ["Scammer", "Phishing", "Honeypot"];
    mapping(address => Report[]) private reports;
    mapping(address => mapping(address => bool)) private hasReported;
    struct Report {
        string[] threats;
        address reporter;
        uint256 timestamp;
    }
    event ReportSubmitted(address reportedAddress, address reporter);
    constructor(address[] memory _owners) {
        require(_owners.length > 0, "At least one owner required");
        for (uint256 i = 0; i < _owners.length; i++) {
            owners[_owners[i]] = true;
        }
        for (uint256 i = 0; i < threatTypesArray.length; i++) {
            threatTypesMapping[threatTypesArray[i]] = true;
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
        require(msg.sender != _owner, "You cant remove yourself");
        owners[_owner] = false;
    }
    function addThreatType(string memory newThreatType) public onlyOwners {
        require(!threatTypesMapping[newThreatType], "Already exists");
        threatTypesMapping[newThreatType] = true;
        threatTypesArray.push(newThreatType);
    }
    function getThreatTypes() external view returns (string[] memory) {
        return threatTypesArray;
    }
    function ReportAddress(
        address _address,
        string[] calldata _threats
    ) external {
        require(
            !hasReported[_address][msg.sender],
            "You have already reported"
        );
        for (uint256 i = 0; i < _threats.length; i++) {
            require(threatTypesMapping[_threats[i]], "Invalid threat type");
        }
        reports[_address].push(
            Report({
                threats: _threats,
                reporter: msg.sender,
                timestamp: block.timestamp
            })
        );
        hasReported[_address][msg.sender] = true;
        emit ReportSubmitted(_address, msg.sender);
    }
    function GetReports(
        address _address
    ) external view returns (Report[] memory) {
        return reports[_address];
    }
    function GetReportsOfAllAddresses(
        address[] calldata _addresses
    ) external view returns (Report[][] memory _allReports) {
        for (uint i = 0; i < _addresses.length; i++) {
            _allReports[i] = reports[_addresses[i]];
        }
    }
}