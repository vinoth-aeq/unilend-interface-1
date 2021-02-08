import React, { FC, useState } from "react";
import { useStore } from "../../../store/store";
import ContentCard from "../UI/ContentCard/ContentCard";
import FieldCard from "../UI/FieldsCard/FieldCard";
import eth from "../../../assets/eth.svg";
import "./Redeem.scss";
import CurrencySelectModel from "../UI/CurrencySelectModel/CurrencySelectModel";
import { web3Service } from "../../../ethereum/web3Service";
import { UnilendLBContract } from "../../../ethereum/contracts/UnilendLBContract";
import web3 from "../../../ethereum/web3";
import { getUniLendLbRouter } from "../../../services/contractService";
interface Props {}

const Redeem: FC<Props> = (props) => {
  const state: any = useStore()[0];
  const dispatch: any = useStore(true)[1];
  const [redeemAmount, setRedeemAmount] = useState("");
  const setMessage = useState("")[1];
  const [showModel, setShowModel] = useState(false);
  const [currFieldName, setCurrFieldName] = useState("");
  const [youRedeem, setYouRedeem] = useState("ht");
  const handleModelClose = () => {
    setShowModel(false);
  };

  const handleModelOpen = (fieldName: string) => {
    setCurrFieldName(fieldName);
    setShowModel(true);
  };
  const handleCurrChange = (selectedField: any) => {
    console.log("selected", selectedField);
    setYouRedeem(selectedField.name);
    setShowModel(false);
  };

  const connectWallet = async () => {
    setMessage("Waiting on transaction success...");
    let accounts;
    accounts = await web3Service.getAccounts();
    dispatch("CONNECT_WALLET", { accounts });
    await getUniLendLbRouter(dispatch);
    setMessage("You have been entered!");
  };

  const handleRedeem = async () => {
    debugger;
    const unilendLB = UnilendLBContract(state.unilendLbRouter);
    let fullAmount = web3.utils.toWei(redeemAmount, "ether");
    unilendLB.methods.redeemETH(fullAmount).send({
      from: state.accounts[0],
    });
    // .on("transactionHash", (result: any) => {
    //   console.log(result);
    // })
    // .on("error", function (error: Error) {
    //   console.log(error);
    // });
  };

  return (
    <>
      <ContentCard title="Redeem">
        <div className="mb-3">
          <div className="row mt-3">
            <div className="col-6">
              <img className="ticker_img  mr-2" src={eth} alt="Eth" />
              <span className="ticker_name">uWETH</span>
            </div>
            <div className="col-6" style={{ textAlign: "right" }}>
              <p className="collateralAmount">0</p>
            </div>
          </div>
          <hr className="ticket_linebreak" />
          <div className="row mt-3">
            <div className="col-6">
              <img className="ticker_img  mr-2" src={eth} alt="Eth" />
              <span className="ticker_name">ETH</span>
            </div>
            <div className="col-6" style={{ textAlign: "right" }}>
              <p className="collateralAmount">0</p>
            </div>
            <hr className="ticket_linebreak" />
          </div>
        </div>
        <FieldCard
          onF1Change={(e: any) => {
            setRedeemAmount(e.target.value);
          }}
          fieldType="number"
          handleModelOpen={() => handleModelOpen("youRedeem")}
          fieldLabel="You Redeem"
          selectLabel=""
          selectValue={youRedeem}
          list={state.currency}
        />
        <div className="d-grid pt-4">
          {state.accounts.length > 0 ? (
            <button
              className="btn btn-lg btn-custom-primary"
              onClick={handleRedeem}
              type="button"
            >
              Redeem
            </button>
          ) : (
            <button
              className="btn btn-lg btn-custom-primary"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
        <div className="price_head py-3">
          <div className="price_aa">
            <div className="price-list">
              Liquidity Available ( ETH )<span className="price">-</span>
            </div>
          </div>
        </div>
        <CurrencySelectModel
          show={showModel}
          handleClose={handleModelClose}
          handleCurrChange={(selectedField) => handleCurrChange(selectedField)}
          currFieldName={currFieldName}
        />
      </ContentCard>
    </>
  );
};

export default Redeem;
