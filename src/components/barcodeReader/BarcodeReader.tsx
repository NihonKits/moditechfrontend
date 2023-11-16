import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface Prop {
  setBarcodeData: (barcode: string) => void;
}

const BarcodeReader = ({ setBarcodeData }: Prop) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      true
    );

    scanner.render(success, error);

    function success(result: any) {
      setBarcodeData(result);
    }

    function error(err: any) {
      console.log(err);
    }
  }, []);

  return (
    <div>
      <div id="reader"></div>
    </div>
  );
};

export default BarcodeReader;
