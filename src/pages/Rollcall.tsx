import React, { useState } from "react";
import { useZxing } from "react-zxing";
import { Button } from "@/components/ui/button";

const Rollcall = () => {
  const [result, setResult] = useState("");
  const {
    ref,
    torch: { on, off, isOn, isAvailable },
  } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
    },
  });
  return (
    <div className="flex flex-col w-full h-full gap-2 p-8 items-center">
      <div className="relative w-fit h-fit">
        <video
          ref={ref}
          className="max-h-[70vh] w-fit rounded-xl border border-border overflow-hidden"
        />
        {/* </div> */}
        {/* absolutely postioned button on top of video */}
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg"
          onClick={() => (isOn ? off() : on())}
          disabled={!isAvailable}
        >
          {isOn ? "🔦" : "🔅"}
        </Button>
      </div>

      <p>
        <span>Last result:</span>
        <span>{result}</span>
      </p>
    </div>
  );
};

export default Rollcall;
