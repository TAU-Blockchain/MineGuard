// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "forge-std/Test.sol";
import "../src/ReportContract.sol";
/**
 * @title ReportContractTest
 * @dev Unit tests for the ReportContract using Foundry's testing framework.
 *      Ensures the contract functions as expected by simulating different scenarios.
 */
contract ReportContractTest is Test {
    ReportContract private reportContract;
    address private owner1 = address(0x1);
    address private owner2 = address(0x2);
    address private user1 = address(0x3);
    address private user2 = address(0x4);
    address private reportedAddress = address(0x5);
    /**
     * @notice Sets up the test environment before each test case runs.
     * @dev Deploys the ReportContract with two owners.
     */
    function setUp() public {
        
        address[] memory owners = new address[](2);
        owners[0] = owner1;
        owners[1] = owner2;
        vm.prank(owner1);
        reportContract = new ReportContract(owners);
    }
      /**
     * @notice Tests the ability of an owner to add a new owner.
     * @dev Ensures that a newly added owner can perform owner-restricted actions.
     */
    function testAddOwner() public {
        
        vm.prank(owner1);
        reportContract.addOwner(user1);
       
        vm.prank(user1);
        reportContract.addThreatType("NewThreat");
    }
    /**
     * @notice Tests that a non-owner cannot add a new owner.
     */
    function testAddOwnerByNonOwner() public {
        
        vm.prank(user1);
        vm.expectRevert("Not an owner");
        reportContract.addOwner(user2);
    }
     
    /**
     * @notice Tests the ability of an owner to remove another owner.
     * @dev Ensures the removed owner loses their privileges.
     */
    function testRemoveOwner() public {
      
        vm.prank(owner1);
        reportContract.removeOwner(owner2);
        
        vm.prank(owner2);
        vm.expectRevert("Not an owner");
        reportContract.addThreatType("AnotherThreat");
    }
    /**
     * @notice Tests that an owner cannot remove themselves.
     */
    function testRemoveSelfAsOwner() public {
        
        vm.prank(owner1);
        vm.expectRevert("You cant remove yourself");
        reportContract.removeOwner(owner1);
    }
    /**
     * @notice Tests the ability of an owner to add a new threat type.
     * @dev Ensures the new threat type is successfully stored and retrievable.
     */
    function testAddThreatType() public {
        
        vm.prank(owner1);
        reportContract.addThreatType("Malware");
        string[] memory threats = reportContract.getThreatTypes();
        bool found = false;
        for (uint i = 0; i < threats.length; i++) {
            if (keccak256(bytes(threats[i])) == keccak256(bytes("Malware"))) {
                found = true;
                break;
            }
        }
        assertTrue(found, "Malware threat type should be added");
    }
    
      /**
     * @notice Tests that an owner cannot add an existing threat type.
     */   
    function testAddExistingThreatType() public {
       
        vm.prank(owner1);
        vm.expectRevert("Already exists");
        reportContract.addThreatType("Scammer");
    }
    /**
     * @notice Tests the reporting functionality for an address.
     * @dev Ensures a report is stored correctly and retrievable.
     */
    function testreport() public {
        
        vm.prank(user1);
        string[] memory threats = new string[](1);
        threats[0] = "Scammer";
        reportContract.report(reportedAddress, threats);
        ReportContract.Report[] memory reports = reportContract.getReports(
            reportedAddress
        );
        assertEq(reports.length, 1);
        assertEq(reports[0].reporter, user1);
        assertEq(reports[0].threats[0], "Scammer");
    }
    /**
     * @notice Tests that a report cannot be submitted with an invalid threat type.
     */
    function testreportWithInvalidThreat() public {
      
        vm.prank(user1);
        string[] memory threats = new string[](1);
        threats[0] = "InvalidThreat";
        vm.expectRevert("Invalid threat type");
        reportContract.report(reportedAddress, threats);
    }
    /**
     * @notice Tests that the same user cannot report the same address multiple times.
     */
    function testreportTwiceBySameUser() public {
        vm.prank(user1);
        string[] memory threats = new string[](1);
        threats[0] = "Scammer";
        reportContract.report(reportedAddress, threats);
        vm.prank(user1);
        vm.expectRevert("You have already reported");
        reportContract.report(reportedAddress, threats);
    }
    /**
     * @notice Tests retrieving reports for multiple addresses.
     * @dev Ensures all reports are correctly fetched for a given list of addresses.
     */
    function testGetReportsOfAllAddresses() public {
       
        vm.prank(user1);
        string[] memory threats1 = new string[](1);
        threats1[0] = "Scammer";
        reportContract.report(reportedAddress, threats1);
        vm.prank(user2);
        string[] memory threats2 = new string[](1);
        threats2[0] = "Phishing";
        reportContract.report(user1, threats2);
        address[] memory addresses = new address[](2);
        addresses[0] = reportedAddress;
        addresses[1] = user1;
        
        ReportContract.Report[][]
            memory allReports = new ReportContract.Report[][](addresses.length);
        for (uint i = 0; i < addresses.length; i++) {
            ReportContract.Report[] memory reports = reportContract.getReports(
                addresses[i]
            );
            allReports[i] = new ReportContract.Report[](reports.length);
            for (uint j = 0; j < reports.length; j++) {
                allReports[i][j] = reports[j];
            }
        }
        // Validate the retrieved reports
        assertEq(allReports.length, 2);
        assertEq(allReports[0].length, 1);
        assertEq(allReports[1].length, 1);
        assertEq(allReports[0][0].reporter, user1);
        assertEq(allReports[1][0].reporter, user2);
    }
}