import React, { Component } from "react";

import * as artifact from "./contracts/Token";

class App extends Component {
  constructor(props) {
    super(props);

    window.tronWeb.setDefaultBlock("latest");

    this.contract = null;
    this.state = {
      address: null,
      youraddress: null,
      balance: 0,
      contract: null,
      tokenBalance: 0,
      profit: 0,
      referralrewards: 0,
      investors: 0,
      totalPayout: 0,
      globalinvest: 0,
      invested: 0,
      totalRefPayout: 0,
      aff1sum: 0,
        aff2sum: 0,
        aff3sum:0,
      payoutSum: 0,
      upline: 0,
        uri: window.location.host,
        balancesmart:0
    };
  }

  async componentDidMount() {
    let tronWeb = window.tronWeb;
    this.setState({
      address:
        " https://" +
        this.state.uri +
        "/?upline=" +
        tronWeb.defaultAddress.base58,
    });
    this.setState({ youraddress: tronWeb.defaultAddress.base58 });
    let address = tronWeb.address.fromHex(artifact.networks["*"].address);
    this.contract = tronWeb.contract(artifact.abi, address);

    setInterval(() => {
      this.refreshBalance();
      this.getContractBalance();
      this.getProfit();
      this.totalInvested();
      this.investors();
      this.getContractData();
    }, 2000);
    setTimeout(() => {
      const queryString = window.location.search;
      const urlParams = queryString.split("upline=");
      const referralid = urlParams[1];
      console.log(referralid,'referralid')
      this.setState({ upline: referralid });
    }, 100);
  }

  getProfit = async () => {
    let tronWeb = window.tronWeb;

    this.contract
      .getProfit(tronWeb.defaultAddress.base58)
      .call()
      .then((output) => {
        const mas = parseInt(output._hex, 16) / 1e6;
        this.setState({ profit: mas });
      });
  };
  totalInvested = async () => {
    let tronWeb = window.tronWeb;
    this.contract
      .totalInvested()
      .call()
      .then((output) => {
        this.setState({
          invested: parseInt(output._hex, 16) / 1e6,
          totalRefPayout: Math.round((parseInt(output._hex, 16) / 1e6) * 0.15),
        });
      });
  };
  investors = async () => {
    this.contract
      .totalPlayers()
      .call()
      .then((output) => {
        this.setState({ investors: 2 * parseInt(output._hex, 16) });
      });
  };
  getContractData = async () => {
    let tronWeb = window.tronWeb;
    this.contract
      .players(tronWeb.defaultAddress.base58)
      .call()
      .then((output) => {
        this.setState({
          trxDeposit: parseInt(output.trxDeposit._hex, 16) / 1e6,
          aff1sum: parseInt(output.aff1sum._hex, 16),
          aff2sum: parseInt(output.aff2sum._hex, 16),
          aff3sum: parseInt(output.aff3sum._hex, 16),
          aff4sum: parseInt(output.aff4sum._hex, 16),
          affRewards: parseInt(output.affRewards._hex, 16) / 1e6,
          payoutSum:
            parseInt(output.payoutSum._hex, 16) / 1e6 +
            parseInt(output.affRewards._hex, 16) / 1e6,
        });
      });
  };

  refreshBalance = async () => {
    let tronWeb = window.tronWeb;
    this.setState({ balance: await tronWeb.trx.getBalance(this.address) });
  };

  refreshTokenBalance = async () => {
    let tronWeb = window.tronWeb;
    this.contract
      .balances(this.state.address)
      .call()
      .then((output) => {
        this.setState({ tokenBalance: output.toString() });
      });
  };

  getContractBalance = async () => {
    let tronWeb = window.tronWeb;
    const address = "TRpgpegBoRZhZYXY8pk51HSnRg2VF8HNS1";
      const balance = await tronWeb.trx.getBalance(address);
      this.setState({ balancesmart: balance / 1e6  });
      console.log(balance / 1e6 )
  };

  withdraw = async () => {
    let tronWeb = window.tronWeb;
    this.contract
      .withdraw()
      .send()
      .then((output) => {
        alert("Contract send withdraw:");
      });
  };

  reinvest = async () => {
    let tronWeb = window.tronWeb;
    this.contract
      .reinvest()
      .send({
        from: tronWeb.defaultAddress.base58,
      })
      .then((output) => {
        alert("Compound success");
      });
  };
  async invest() {
    let tronWeb = window.tronWeb;
    const num = document.getElementById("invest").value;
    console.log(num)
    if (num > 99) {
      const addref = tronWeb.isAddress(this.state.upline)
        ? this.state.upline
        : "TTjeh4dbGvft7BwoVk9Qjq8xgiD8pZKUSC";
      this.contract
        .deposit(addref)
        .send({
          callValue: 1e6 * Number(num),
        })
        .then((output) => {
          alert("Invest success");
        });
    } else {
      alert("Your investment must be greater. at 20 TRX");
      document.getElementById("invest").value = 22;
    }
  }
  copytextInpt() {
    /* Get the text field */
    var copyText = document.getElementById("upline");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
  }

  render() {
    return (
      <div className="App">
        {/* Header init */}
        <div className="me-main-header">
        <div className="container">
        <div className="row">
            <div className="col-sm-3 col-7">
                <div className="me-logo ptb">
                    <a className="amega" href="/">MEGA TRON</a>
                </div>
            </div>
            <div className="col-sm-9 col-5">
                <div className="me-menu">
                    <ul>
                        <li className="me-menu-children"><a href="javascript:;" className="me-active-menu">Your Address : {this.state.youraddress}</a>
                        
                    </li>
                   
                    </ul>
                    <div className="me-toggle-nav">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        {/* Header fin */}
        {/* Banner */}
        <div className="me-banner">
          <div className="container">
            <div className="row">
              <div className="col-md-7 col-12">
                <div className="me-banner-text">
                <h1>50% BASIC DAILY INCOME</h1>
                        <div>
                            <ul className="col-bs">
                                <li>✅Períodos: ∞</li>
                                <li>🏦 Minimum deposit 100 TRX</li>
                                <li>✅ Monthly profit: 1500%</li>
                                <li>50% ROI DAILY🔥</li>
                                <li>💸 11% Direct Referrals</li>
                            </ul>
                  </div>
                  <br/>
                  <a href="https://t.me/MegaTron" className="me-btn">Join Telegram</a>
                    <a href="https://tronscan.io/#/contract/TRpgpegBoRZhZYXY8pk51HSnRg2VF8HNS1" className="me-btn">Verified Contract</a>
                  </div>
              </div>
              <div className="col-md-5 col-12">
                <div className="me-banner-form">
                    <div className="me-banner-form-bg">
                        <h1>My investment
                        </h1>
                        
                        <div className="me-flex">
                            Earn from the first moment you start investing make compound interest and share this opportunity

                        </div>
                    <div className="range-slider">
                    <input
                        id="invest"
                        defaultValue="100"
                        type="number"
                        name="invest"
                        className=" invest currency-input--src body-font font-w--600"
                      />
                         
                    </div>
                    <p>Balance of Your : {this.state.balance / 1e6} TRX</p>
                    <button button onClick={() => this.invest()} className="me-btn bgver">Invest</button>
                    <br/>
                    <button button onClick={() => this.reinvest()} className="me-btn">Compound</button>
                    <button button onClick={() => this.withdraw()} className="me-btn blue">Withdraw</button>
                    <br />
                    <p>1-3 TRX transaction fee will be applied</p>
                    <p><a className="masr" href="https://tronscan.io/#/contract/TRpgpegBoRZhZYXY8pk51HSnRg2VF8HNS1">TRpgpegBoRZhZYXY8pk51HSnRg2VF8HNS1</a></p>
                    </div>
                </div>
              </div>
          
            </div>
             
          </div>
        </div>
        {/* Banner fin */}
        {/* INvest */}
        <div className="me-feature">
          <div className="container">

            <div className="row">
             
              <div className="col-lg-12 col-md-12">
              <h6>Referral link</h6>
                <div className="input-group d-flex">
                  <input
                    id="upline"
                    type="text"
                    className="dhs form-control"
                    defaultValue={this.state.address}
                  />
                  <button
                    onClick={() => this.copytextInpt()}
                    className="btn btn-hover--splash btn-bg--cta--1"
                    type="button"
                  >
                    <span className="btn__text">Copy</span>
                  </button>
                </div>
                <p>
                  Referral rewards will be transfered to your wallet directly.
                  You do not need to manually withdraw them.
                </p>
                <br />
                </div>
          </div>
       <br/>
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="me-feature-box">
                <h2> Investors
                    </h2>
                    <p>{this.state.investors} </p> 
                 
                  


                  </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="me-feature-box">
                <h2> Invested
                    </h2>
                    <p>{this.state.invested} <strong>TRX</strong></p> 
            
                  </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="me-feature-box">
                <h2>Balance smart contract 
                    </h2>
                    <p>  {this.state.balancesmart}<strong>TRX</strong></p> 
            
                  </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="me-feature-box">
                <h2>Total referral rewards
                    </h2>
                    <p>{this.state.totalRefPayout}<strong>TRX</strong></p>
            
                  </div>
                </div>    
            </div>
            <br/>
            <div className="row">
            <div className="col-lg-6 col-md-6">
                <div className="me-feature-box">
                <h2>Your investments

                </h2>
                  <p> {this.state.trxDeposit} <strong>TRX</strong></p>
                </div>
            </div>
            <div className="col-lg-6 col-md-6">
                <div className="me-feature-box">
                    <h2>Available to withdraw

                    </h2>
                  <p>
                  {this.state.profit}  <strong>TRX</strong>
                  </p>
                    </div>
            </div>
        </div>
            
    
          </div>
          
          </div>
        {/* inves */}

      
        {/* feature */}

        <div className="me-how-work me-padder-top-less me-padder-bottom">
    <div className="container">
        <div className="me-heading2">
       
            <h1>Referral Status <br/> Total Referral Rewards: {this.state.payoutSum}  TRX
            </h1>
        </div>
        <div className="row">
            <div className="col-lg-4 col-md-6">
                <div className="me-hwork-box">
                    <div className="me-hwork-svg">
                    {this.state.aff1sum}                           
                    </div>
                    <h4 className="ama">Direct(11%)</h4>
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="me-hwork-box">
                    <div className="me-hwork-svg">
                    {this.state.aff2sum} 
                        </div>  
                    <h4 lass="ama"> Tier 1 (11%)</h4>
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="me-hwork-box">
                    <div className="me-hwork-svg">
                    {this.state.aff3sum}                                                                        
                    </div>
                    <h4 lass="ama">Tier 2 (11%)</h4>
                </div>
              </div>
              
            {/* <div className="col-lg-3 col-md-6">
                <div className="me-hwork-box">
                    <div className="me-hwork-svg">
                    {this.state.aff4sum}                                                       
                    </div>
                    <h4 className="ama">Tier 3</h4>
                </div>
            </div> */}
          
            </div>
        
        
     
    </div>
</div>

    
     
      </div>
    );
  }
}

export default App;
