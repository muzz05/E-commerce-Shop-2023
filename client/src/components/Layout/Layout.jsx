import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

function Layout(props) {
  return (
    <>
      <Header />
      <main
        className="main-Layout"
        style={{ overflowY: "auto", height: "77vh" }}
      >
        <Toaster />
        {props.children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
