import "./Paywall.css";
import { useNavigate, useLocation } from "react-router-dom";
import { requestProvider } from "webln";
import axios from "axios";
import { useEffect, useState } from "react";

function Paywall() {
  const [invoice, setInvoice] = useState("");
  const [payment, setPayment] = useState("");
  let navigate = useNavigate();

  const { state } = useLocation();


  useEffect(() => {
    fetchInvoice();
  }, []);

  useEffect(() => {
    if (payment !== "") {
      localStorage.setItem("paid", true);
      const post = state.paywallPost;
      navigate(`/post/${post.id}`, {
        state: {
          post,
        },
      });
    }
  }, [payment, navigate, state]);

  const navigateHome = () => {
    navigate("/");
  };

  const managePayment = async () => {
    const webln = await requestProvider();
    const payment = await webln.sendPayment(invoice);
    setPayment(payment);
  };

  const fetchInvoice = async () => {
    const apiKey = "e356a33d5d47479295d88106159f705b";
    const data = `{"out": false, "amount": 5, "memo": "OmgLN1", "unit": "sat", "webhook": "", "internal": false}`;
    const getInvoice = {
      method: "POST",
      headers: { "content-type": "application/json", "X-Api-Key": apiKey },
      data: data,
      url: "https://legend.lnbits.com/api/v1/payments",
    };
    await axios
      .request(getInvoice)
      .then(async function (res) {
        setInvoice(res.data.payment_request);
      })
      .catch(function (err) {
        console.log("error = " + err);
      });
  };

  return (
    <div className="paywallPage">
      <div className="paywallContainer">
        <div className="paywallTitle">
          <h1>Paywall</h1>
        </div>
        <div className="paywallText">
          This is premium content. You need to pay 5 sats to read this blog
          post.
        </div>
      </div>
      <div className="buttonLayout">
        <button className="buttonStyle" onClick={navigateHome}>
          Go back
        </button>
        <button className="buttonStyle" onClick={managePayment}>
          Pay
        </button>
      </div>
    </div>
  );
}

export default Paywall;
