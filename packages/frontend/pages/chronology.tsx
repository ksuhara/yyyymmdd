import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Button, Heading, Input, Text, Textarea } from "@chakra-ui/react";
import React from "react";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { createFirebaseApp } from "../firebase/clientApp";
import { useBooks } from "../hooks/useBooks";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Book } from "../firebase/books";
import { ethers } from "ethers";
import contract from "../constants/contract.json";

const contractAddress = "0x0dca239715F64b42a5305e236F4380424036893a";
const abi = contract.abi;

const Home: NextPage = () => {
  const { isLoading, books } = useBooks();

  const [content, setContent] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(new Date() as any);
  const [currentAccount, setCurrentAccount] = React.useState(null);
  const [displayBook, setDisplayBook] = React.useState<Book>();
  const [error, setError] = React.useState("");

  const [mode, setMode] = React.useState<"view" | "edit">("view");

  React.useEffect(() => {
    createFirebaseApp();
  }, []);

  React.useEffect(() => {
    const tokenId = getTokenIdFromDate(selectedDate);
    const findBook = books.find((element) => element.tokenId == tokenId);
    setDisplayBook(findBook);
  }, [selectedDate]);

  const getTokenIdFromDate = (date: any) => {
    const date1 = new Date("1970/01/01") as any;
    const diffTime = Math.abs(date - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const createContent = async () => {
    const db = getFirestore();
    const tokenId = getTokenIdFromDate(selectedDate);
    console.log("test");
    const bookContent = { tokenId: tokenId, date: selectedDate, title: "title", content, walletAddress: "" };
    await setDoc(doc(db, "books", tokenId.toString()), bookContent);

    alert("Book updated!!");
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
      window.open("https://metamask.app.link/dapp/https://pixel-onchained.vercel.app/");
    }
    setError("");

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, abi, signer);
      const tokenId = getTokenIdFromDate(selectedDate);
      console.log(tokenId);
      const owner = await nftContract.ownerOf(tokenId);
      console.log(owner.toLowerCase());
      console.log(accounts[0]);
      if (owner.toLowerCase() !== accounts[0]) {
        setError("not owner of the token");
        throw new Error("not owner of the token");
      }
      setCurrentAccount(accounts[0]);
    } catch (err: any) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <Heading>Chronology Page</Heading>
      <Text>Select Date</Text>
      <DatePicker
        dateFormat="yyyy/MM/dd"
        minDate={new Date("1970/01/01")}
        maxDate={new Date()}
        selected={selectedDate}
        showMonthDropdown
        scrollableYearDropdown
        showYearDropdown
        onChange={(date) => setSelectedDate(date)}
        inline
      />

      {mode == "view" ? (
        <>
          {displayBook ? <Text>{displayBook.content}</Text> : <></>}
          {currentAccount ? (
            <Button my="4" size="md" colorScheme="blue" fontWeight="bold" onClick={() => setMode("edit")}>
              Edit
            </Button>
          ) : (
            <Button my="4" size="md" colorScheme="blue" fontWeight="bold" onClick={connectWalletHandler}>
              ConnectWallet
            </Button>
          )}
          <Text color={"red"}>{error}</Text>
        </>
      ) : (
        <></>
      )}
      {mode == "edit" ? (
        <>
          <Text my="2">Set your story</Text>
          <Textarea my="2" onChange={(e) => setContent(e.target.value)}></Textarea>
          <Button my="2" onClick={createContent}>
            テスト
          </Button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;
