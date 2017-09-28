pragma solidity ^0.4.15;

library ShoutSenseUtils {

  function echoTest(bytes echo) internal constant returns (bytes) {
    return echo;
  }

  function bytes32ToString(bytes32 b32) internal returns (string) {
    bytes memory s = new bytes(64);

    for (uint8 i = 0; i < 32; i++) {
        byte b = byte(b32[i]);
        byte hi = byte(uint8(b) / 16);
        byte lo = byte(uint8(b) - 16 * uint8(hi));
        s[i*2] = char(hi);
        s[i*2+1] = char(lo);
    }

    return string(s);
  }

  function char(byte b) internal returns (byte c) {
    if (b < 10) return byte(uint8(b) + 0x30);
    else return byte(uint8(b) + 0x57);
  }

  function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string) {
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    bytes memory _bc = bytes(_c);
    bytes memory _bd = bytes(_d);
    bytes memory _be = bytes(_e);
    string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
    bytes memory babcde = bytes(abcde);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
    for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
    for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
    for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
    return string(babcde);
  }

  function strConcat(string _a, string _b, string _c, string _d) internal returns (string) {
      return strConcat(_a, _b, _c, _d, "");
  }

  function strConcat(string _a, string _b, string _c) internal returns (string) {
      return strConcat(_a, _b, _c, "", "");
  }

  function strConcat(string _a, string _b) internal returns (string) {
      return strConcat(_a, _b, "", "", "");
  }
}
