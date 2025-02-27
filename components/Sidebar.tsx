import Link from "next/link";
    import { Button } from "@/components/ui/button";
    import {
      HomeIcon,
      PlusCircle,
      Trash2,
      Settings,
      User,
      File,
      Search,
      ChevronDown,
      Zap,
    } from "lucide-react";
    import { Separator } from "@/components/ui/separator";
    import { useAuth } from "@/app/context/AuthContext";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

    interface SidebarProps {
      onNewChat: () => void;
    }

    export function Sidebar({ onNewChat }: SidebarProps) {
      const { user } = useAuth();

      return (
        <div className="w-[360px] h-screen bg-slate-50 border-r border-slate-200 flex-col justify-start items-start inline-flex overflow-hidden">
          <div className="self-stretch h-[1129px] flex-col justify-start items-start flex">
            <div className="self-stretch px-6 py-5 border-b border-slate-300 justify-start items-center gap-4 inline-flex">
              <div className="grow shrink basis-0 h-[38px] justify-start items-center gap-2 flex">
                {/* Replace with your actual logo */}
                <div className="relative w-8 h-8">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.9688 11.3511C29.9688 11.3649 29.9688 11.3774 29.9601 11.3911L27.1251 24.3749C27.0378 24.8321 26.7938 25.2445 26.4351 25.5411C26.0764 25.8378 25.6255 26 25.1601 25.9999H6.83882C6.37359 25.9997 5.92297 25.8373 5.56454 25.5407C5.20611 25.2441 4.9623 24.8319 4.87507 24.3749L2.04007 11.3911C2.04007 11.3774 2.03382 11.3649 2.03132 11.3511C1.95373 10.9213 2.01901 10.4778 2.21718 10.0885C2.41536 9.69925 2.73553 9.38555 3.12878 9.19538C3.52203 9.0052 3.96673 8.949 4.39493 9.03536C4.82313 9.12172 5.21128 9.3459 5.50007 9.67364L9.70882 14.2099L14.1838 4.17364C14.184 4.16947 14.184 4.1653 14.1838 4.16114C14.3438 3.81407 14.5999 3.52012 14.9218 3.31408C15.2437 3.10804 15.6179 2.99854 16.0001 2.99854C16.3822 2.99854 16.7564 3.10804 17.0783 3.31408C17.4002 3.52012 17.6563 3.81407 17.8163 4.16114C17.8161 4.1653 17.8161 4.16947 17.8163 4.17364L22.2913 14.2099L26.5001 9.67364C26.7895 9.34833 27.1771 9.12635 27.6041 9.0414C28.0312 8.95645 28.4742 9.01317 28.8661 9.20294C29.258 9.39272 29.5772 9.70519 29.7753 10.0929C29.9734 10.4806 30.0396 10.9224 29.9638 11.3511H29.9688Z"
                      fill="#4F46E5"
                    />
                  </svg>
                </div>
                <div className="text-slate-800 text-3xl font-extrabold font-['Plus Jakarta Sans'] leading-[38px]">
                  STUDY+
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 text-slate-500" />
              </Button>
            </div>
            <div className="self-stretch h-16 px-6 py-5 flex-col justify-start items-start gap-2.5 flex">
              <Button
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={onNewChat}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New chat
              </Button>
            </div>
            <Separator className="my-2" />
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-2">
                <div className="text-sm text-gray-500">Your conversations</div>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-slate-100"
                >
                  <HomeIcon className="mr-2 h-4 w-4 text-slate-600" />
                  Example Conversation
                </Button>
                {/* Add more conversation items here */}
              </div>
              <div className="p-4 space-y-2">
                <div className="text-sm text-gray-500">Today</div>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-slate-100"
                >
                  How to be a better person?
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-slate-100"
                >
                  Hacking FBI server with linux
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start bg-indigo-50 border-r-4 border-indigo-600 hover:bg-indigo-100"
                >
                  How to get rich from youtube...
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-slate-100"
                >
                  Help me with web development...
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-slate-100"
                >
                  REACT NEXTJS Tutorial
                </Button>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-sm text-gray-500">Previous 7 Days</div>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-slate-100"
                >
                  Mobile app prototypes library
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-slate-100"
                >
                  ROM Types and uses
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-slate-100"
                >
                  Fix SSL/TLS Error
                </Button>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-slate-100"
              >
                <Trash2 className="mr-2 h-4 w-4 text-slate-600" />
                Clear All
              </Button>
            </div>
            <Separator className="my-2" />
            <div className="p-4 flex flex-col space-y-2">
              <Link href="/settings">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-slate-100"
                >
                  <Settings className="mr-2 h-4 w-4 text-slate-600" />
                  Settings
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-slate-100"
                >
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {user ? user.email.substring(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {user ? user.email : "Profile"}
                </Button>
              </Link>
            </div>
            <div className="self-stretch h-[88px] px-6 py-5 justify-start items-center gap-4 inline-flex">
                <Button variant="outline" className="flex-grow">
                    <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                    <div className="flex-col justify-start items-start gap-1 inline-flex">
                        <div className="self-stretch text-slate-800 text-base font-bold font-['Plus Jakarta Sans'] leading-snug">Upgrade Plan</div>
                        <div className="self-stretch text-slate-600 text-sm font-normal font-['Plus Jakarta Sans'] leading-snug">Get GPT-8 and more</div>
                    </div>
                </Button>
            </div>
          </div>
        </div>
      );
    }
