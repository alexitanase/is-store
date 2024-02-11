export default {
  symbolFormat(code): string  {
    switch (code) {
      case "EUR":
        return '&euro;';
      default:
        return code;
    }
  }
}