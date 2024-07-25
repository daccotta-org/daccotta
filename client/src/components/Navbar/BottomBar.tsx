import { FC } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

import { IoLogInOutline } from "react-icons/io5";
import ThemeController from "./ThemeController";

const Bottom: FC = () => {
  return (
    <>
      <SignedIn>
        <div className=" p-2 h-full w-full flex flex-col items-center justify-center gap-10 ">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: "bg-slate-500 hover:bg-slate-400",
              },
            }}
          />
          <ThemeController />
        </div>
      </SignedIn>
      <SignedOut>
        <IoLogInOutline />
      </SignedOut>
    </>
  );
};

export default Bottom;
