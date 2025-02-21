// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/ReportContract.sol";

contract ReportContractTest is Test {
    ReportContract private reportContract;
    address private owner1 = address(0x1);
    address private owner2 = address(0x2);
    address private user1 = address(0x3);
    address private user2 = address(0x4);
    address private reportedAddress = address(0x5);

    function setUp() public {
        // Sözleşmeyi iki owner ile başlatıyoruz
        address[] memory owners = new address[](2);
        owners[0] = owner1;
        owners[1] = owner2;
        vm.prank(owner1);
        reportContract = new ReportContract(owners);
    }

    function testAddOwner() public {
        // Yeni bir owner ekleme testi
        vm.prank(owner1);
        reportContract.addOwner(user1);
        // user1'in owner olduğunu doğruluyoruz
        vm.prank(user1);
        reportContract.addThreatType("NewThreat");
    }

    function testAddOwnerByNonOwner() public {
        // Owner olmayan birinin owner eklemeye çalışması
        vm.prank(user1);
        vm.expectRevert("Not an owner");
        reportContract.addOwner(user2);
    }

    function testRemoveOwner() public {
        // Bir owner'ı kaldırma testi
        vm.prank(owner1);
        reportContract.removeOwner(owner2);
        // owner2'nin artık owner olmadığını doğruluyoruz
        vm.prank(owner2);
        vm.expectRevert("Not an owner");
        reportContract.addThreatType("AnotherThreat");
    }

    function testRemoveSelfAsOwner() public {
        // Bir owner'ın kendini kaldırmaya çalışması
        vm.prank(owner1);
        vm.expectRevert("You cant remove yourself");
        reportContract.removeOwner(owner1);
    }

    function testAddThreatType() public {
        // Yeni bir tehdit türü ekleme testi
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

    function testAddExistingThreatType() public {
        // Mevcut bir tehdit türünü eklemeye çalışmak
        vm.prank(owner1);
        vm.expectRevert("Already exists");
        reportContract.addThreatType("Scammer");
    }

    function testReportAddress() public {
        // Bir adresi raporlama testi
        vm.prank(user1);
        string[] memory threats = new string[](1);
        threats[0] = "Scammer";
        reportContract.ReportAddress(reportedAddress, threats);

        ReportContract.Report[] memory reports = reportContract.GetReports(
            reportedAddress
        );
        assertEq(reports.length, 1);
        assertEq(reports[0].reporter, user1);
        assertEq(reports[0].threats[0], "Scammer");
    }

    function testReportAddressWithInvalidThreat() public {
        // Geçersiz bir tehdit türüyle raporlama girişimi
        vm.prank(user1);
        string[] memory threats = new string[](1);
        threats[0] = "InvalidThreat";
        vm.expectRevert("Invalid threat type");
        reportContract.ReportAddress(reportedAddress, threats);
    }

    function testReportAddressTwiceBySameUser() public {
        // Aynı kullanıcının aynı adresi iki kez raporlamaya çalışması
        vm.prank(user1);
        string[] memory threats = new string[](1);
        threats[0] = "Scammer";
        reportContract.ReportAddress(reportedAddress, threats);

        vm.prank(user1);
        vm.expectRevert("You have already reported");
        reportContract.ReportAddress(reportedAddress, threats);
    }

    function testGetReportsOfAllAddresses() public {
        // Farklı adresler için raporları alma testi
        vm.prank(user1);
        string[] memory threats1 = new string[](1);
        threats1[0] = "Scammer";
        reportContract.ReportAddress(reportedAddress, threats1);

        vm.prank(user2);
        string[] memory threats2 = new string[](1);
        threats2[0] = "Phishing";
        reportContract.ReportAddress(user1, threats2);

        address[] memory addresses = new address[](2);
        addresses[0] = reportedAddress;
        addresses[1] = user1;

        // allReports dizisini başlatma
        ReportContract.Report[][]
            memory allReports = new ReportContract.Report[][](addresses.length);
        for (uint i = 0; i < addresses.length; i++) {
            ReportContract.Report[] memory reports = reportContract.GetReports(
                addresses[i]
            );
            allReports[i] = new ReportContract.Report[](reports.length);
            for (uint j = 0; j < reports.length; j++) {
                allReports[i][j] = reports[j];
            }
        }

        assertEq(allReports.length, 2);
        assertEq(allReports[0].length, 1);
        assertEq(allReports[1].length, 1);
        assertEq(allReports[0][0].reporter, user1);
        assertEq(allReports[1][0].reporter, user2);
    }
}
