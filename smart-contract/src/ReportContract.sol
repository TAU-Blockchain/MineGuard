// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
/**
 * @title ReportContract
 * @dev This contract allows users to report malicious addresses and categorize threats.
 *      It also enables contract owners to manage threat types and authorized reporters.
 */
contract ReportContract {
    /// @dev Stores the addresses of contract owners
    mapping(address => bool) private owners;
    /// @dev Stores existing threat types for validation
    mapping(string => bool) private threatTypesMapping;
    /// @dev List of predefined threat types
    string[] private threatTypesArray = [
        "Scammer",
        "Phishing",
        "Honeypot",
        "Hidden Owner Privileges",
        "Approval Draining",
        "Ponzi",
        "Sybil",
        "Rugger"
    ];
    /// @dev Mapping to store reports for each address
    mapping(address => Report[]) private reports;
    /// @dev Tracks whether a specific reporter has already reported an address
    mapping(address => mapping(address => bool)) private hasReported;
    /// @dev Structure defining a report
    struct Report {
        string[] threats;
        address reporter;
        uint256 timestamp;
    }
    /// @notice Event emitted when an address is reported
    event ReportSubmitted(address indexed reportedAddress, address indexed reporter);
    /**
     * @notice Initializes the contract with a list of owners.
     * @dev Only the specified owners can manage threat types and authorize reporting.
     * @param _owners List of initial contract owners.
     */
    constructor(address[] memory _owners) {
        require(_owners.length > 0, "At least one owner required");
        for (uint256 i = 0; i < _owners.length; i++) {
            owners[_owners[i]] = true;
        }
        for (uint256 i = 0; i < threatTypesArray.length; i++) {
            threatTypesMapping[threatTypesArray[i]] = true;
        }
    }
    /// @dev Modifier to restrict function access to contract owners
    modifier onlyOwners() {
        require(owners[msg.sender], "Not an owner");
        _;
    }
    /**
     * @notice Adds a new owner to the contract.
     * @dev Only an existing owner can add new owners.
     * @param _newOwner The address of the new owner.
     * 
     * Requirements:
     * - `_newOwner` must not already be an owner.
     */
    function addOwner(address _newOwner) public onlyOwners {
        require(!owners[_newOwner], "Already an owner");
        owners[_newOwner] = true;
    }
    /**
     * @notice Removes an existing owner from the contract.
     * @dev An owner cannot remove themselves from the ownership list.
     * @param _owner The address of the owner to remove.
     * 
     * Requirements:
     * - `_owner` must be an existing owner.
     * - The caller cannot remove themselves.
     */
    function removeOwner(address _owner) public onlyOwners {
        require(owners[_owner], "Not an owner");
        require(msg.sender != _owner, "You cant remove yourself");
        owners[_owner] = false;
    }
    /**
     * @notice Adds a new type of threat to the system.
     * @dev Only contract owners can define new threat types.
     * @param newThreatType The new threat type to add.
     * 
     * Requirements:
     * - `newThreatType` must not already exist.
     */
    function addThreatType(string memory newThreatType) public onlyOwners {
        require(!threatTypesMapping[newThreatType], "Already exists");
        threatTypesMapping[newThreatType] = true;
        threatTypesArray.push(newThreatType);
    }
    /**
     * @notice Returns the list of all valid threat types.
     * @return An array of strings containing all available threat types.
     */
    function getThreatTypes() external view returns (string[] memory) {
        return threatTypesArray;
    }
    /**
     * @notice Allows a user to report a specific address for malicious activity.
     * @dev Ensures that a user can only report an address once. 
     *      Validates that all reported threats exist in the system before recording the report.
     * @param _address The address being reported.
     * @param _threats An array of threat types associated with the reported address.
     * 
     * Requirements:
     * - The sender must not have already reported this address.
     * - Each threat in `_threats` must be a valid, predefined threat type.
     * 
     * Emits a {ReportSubmitted} event upon successful reporting.
     */
    function report(address _address, string[] calldata _threats) external {
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
    /**
     * @notice Retrieves all reports associated with a specific address.
     * @param _address The address whose reports are being requested.
     * @return An array of reports related to the given address.
     */
    function getReports(address _address) external view returns (Report[] memory) {
        return reports[_address];
    }    
}