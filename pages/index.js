import React, { useState, useEffect} from "react";
import CreateProduct from "../components/CreateProduct";
import Product from "../components/Product";
import HeadComponent from '../components/Head';

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Constants
const TWITTER_HANDLE = "AidokenPegasus";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { publicKey } = useWallet();
  const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false );
  const [creating, setCreating] = useState(false);
  const [products, setProducts] = useState([]);
  
  //https://media.giphy.com/media/9LZpR17spJd4aFZW8u/giphy.gif
  //That's the OG gif

  const renderNotConnectedContainer = () => (
    <div>
      <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExanU0bXRtZzlud20za2diZGNvcTExd3lrcHZmcTc4MW8ybmtkYjh3cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/pOXlccJ5WnGjSLzj8k/giphy.gif" alt="emoji" />


      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
      </div>    
    </div>
  );

 
    
  
  useEffect(() => {
    if (publicKey) {
      fetch(`/api/fetchProducts`)
        .then(response => response.json())
        .then(data => {
          setProducts(data);
          console.log("Products", data);
        });
    }
  }, [publicKey]);

  const renderItemBuyContainer = () => (
    <div className="products-container">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );


  
  
  return (
    <div className="App" >
      <HeadComponent/>
      <div className="container">
        
        <header className="header-container">
          <p className="header"></p>
          <p className="sub-text"></p>
          {isOwner && (
            <button className="create-product-button" onClick={() => setCreating(!creating)}>
              {creating ? "Close" : "Create Product"}
            </button>
          )}
        </header>

        <main>
          {creating && <CreateProduct />}
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
        </main>

        <div className="Logo">
          <img src="https://imgur.com/fJEkJvJ.png" ></img>
  
    </div>



<div className="twitter-timeline">
hi i wanna thank you for holding on
</div>

<div className="twitter-timeline2">
hi i wanna thank you for holding on
</div>

<div className="twitter-timeline3">
hi i wanna thank you for holding on
</div>

<div className="twitter-timeline4">
hi i wanna thank you for holding on
</div>


        
        
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;