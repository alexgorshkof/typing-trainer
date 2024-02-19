"use client";

import {
  useEffect,
  useCallback,
  useRef,
  useState,
  TextareaHTMLAttributes,
} from "react";
import { useOnClickOutside } from "usehooks-ts";

export default function Home() {
  const [state, setState] = useState("typing");
  const [text, setText] = useState(
    (
      "The old lady pulled her spectacles down and looked over them about the room;" +
      " then she put them up and looked out under them."
    ).split("")
  );
  const [lastChar, setLastChar] = useState("");
  const [pointer, setPointer] = useState(0);
  const [error, setError] = useState(false);
  const [start, setStart] = useState<Date>();
  const [time, setTime] = useState<number>();

  const handleKeyDown = (e: KeyboardEvent) => {
    setLastChar(e.key);
  };

  useEffect(() => {
    if (pointer === 1) {
      setStart(new Date());
    } else if (pointer > 1) {
      const end = new Date();
      const time = end.getTime() - start!.getTime();
      console.log("Time", time);
      setTime(time / 1000);
    }
  }, [pointer]);

  useEffect(() => {
    if (lastChar === "Shift" || lastChar === "") return;

    console.log(lastChar, text[pointer]);
    if (lastChar === text[pointer]) {
      setPointer((p) => p + 1);
      setError(false);
    } else {
      setError(true);
    }
    setLastChar("");
  }, [lastChar]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const ref = useRef<HTMLTextAreaElement>(null);

  useOnClickOutside(ref, () => {
    if (ref.current) {
      console.log(ref.current.value);
      setText(ref.current.value.split(""));
      setState("typing");
      setPointer(0);
      setError(false);
    }
  });

  return (
    <main className="flex min-h-screen flex-col gap-4 p-24">
      {state === "editing" && (
        <textarea
          ref={ref}
          defaultValue={text.join("")}
          name=""
          id=""
          cols={30}
          rows={10}
        />
      )}

      {state === "typing" && (
        <div
          onClick={() => {
            setState("editing");
          }}
          className="text-xl min-h-24 min-w-96 border-2 border-slate-600 p-4 cursor-text"
        >
          {text.map((c, i) => (
            <span
              key={i}
              className={`
              ${i === pointer ? "border-b-2 border-slate-600" : ""}
              ${i < pointer ? "text-green-600" : ""}
              ${i === pointer && error ? "bg-red-300" : ""}
              `}
            >
              {c}
            </span>
          ))}
        </div>
      )}
      <div>Pointer: {pointer}</div>
      {time && (
        <div>Speed: {Math.round((pointer * 60) / time)} symbols per minute</div>
      )}
    </main>
  );
}
