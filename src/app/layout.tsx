import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Task Management",
  description:
    "Manage and organize tasks effectively with Project Champion. Track progress, assign tasks, and collaborate with your team.",
  keywords: [
    "Task Management",
    "Project Management",
    "Team Collaboration",
    "Productivity",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-inter px-2 md:px-4">
        <div className="w-full max-w-[1290px] py-5 flex flex-col gap-5 md:py-10 mx-auto">
          {children}
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="version2"
        />
      </body>
    </html>
  );
}
