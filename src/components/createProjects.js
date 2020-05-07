import React,{Component} from 'react';
import ProjectList from '../libs/projectList';
import web3 from '../libs/web3';

class createProject extends Component {

    
    constructor(...args) {
        super(...args);
        this.state = {
            //获取metamask的账户是什么
            addresses:[],
            //描述
            description:'',
            //最小投资金额 
            minInvest:0, 
            //最大投资金额
            maxInvest:0,
            //上限
            goal:0,
            //错误提示信息
            errmsg:'',
            //标示成功发起项目成功与否
            flag:false
        }

    }


  async componentDidMount(){
      //获取账户
      const accounts = await web3.eth.getAccounts()
      
      const balances = await Promise.all( accounts.map( address=>web3.eth.getBalance(address) ) )
      this.setState({
        addresses:accounts.map( (account,index)=>{
            let balance = web3.utils.fromWei(balances[index],"ether")
            console.log({address:account,balance})
            return {address:account,balance}
        } )
      })
  }

  async newProject(){
      let description = this.refs["description"].value 
      let minInvest = this.refs["minInvest"].value 
      let maxInvest = this.refs["maxInvest"].value 
      let goal = this.refs["goal"].value
      
      if(!description){
          return this.setState({
              errmsg:"项目描述不能为空！"
          })
      }

      if(minInvest<=0){
        return this.setState({
            errmsg:"最小投资金额不能为0或者负数！"
        })
      }

      if(maxInvest<=0){
        return this.setState({
            errmsg:"最大投资金额不能为0或者负数！"
        })
      }



      if( parseInt(minInvest)>parseInt(maxInvest)){
        return this.setState({
            errmsg:"最小投资金额必须小于等于最大投资金额"
        })
      }

      if(goal<=0){
        return this.setState({
            errmsg:"上限金额不能为0或者负数！"
        })
      } 


      let minInvestWei = web3.utils.toWei(minInvest,"ether")
      let maxInvestWei = web3.utils.toWei(maxInvest,"ether")
      let goalWei = web3.utils.toWei(goal,"ether")

      //获取metamask的账户
      let accounts = await web3.eth.getAccounts()
      let owner = accounts[0]

      //创建
      await ProjectList.methods.createProject(description,minInvestWei,maxInvestWei,goalWei)
                                .send({from:owner,gas:"5000000"})

      this.setState({
          flag:true, 
          errmsg:''
      })
  }


  render() {
    let addresses = this.state.addresses.map((account,index)=>{
        return <span className="label label-info" key={index}>您的账号余额:{account.balance} ETH</span>
    })

    return (
        <div className="container" style={{marginTop:"50px"}}>
            <div className="page-header">
                <h2>发起项目</h2>
               {addresses}
            </div>
            
            {this.state.errmsg!=''?<div className="alert alert-danger" role="alert">{this.state.errmsg}</div>:""}
            <div className="col-md-6">
                <div className="form-group">
                    <label htmlFor="projectDesc">项目描述:</label>
                    <input type="text" className="form-control" id="projectDesc" ref="description" placeholder="例如:项目名称" />
                    
                    <label htmlFor="ProjectminInvest">最小投资金额:</label>
                    <div className="input-group">
                        <input type="text" id="ProjectminInvest" ref="minInvest" className="form-control" placeholder="单位:以太（ETH）" aria-describedby="basic-addon2" />
                        <span className="input-group-addon" id="basic-addon2">以太(ETH)</span>
                    </div>


                    <label htmlFor="ProjectmaxInvest">最大投资金额:</label>
                    <div className="input-group">
                        <input type="text" id="ProjectmaxInvest" ref="maxInvest" className="form-control" placeholder="单位:以太（ETH）" aria-describedby="basic-addon2" />
                        <span className="input-group-addon" id="basic-addon2">以太(ETH)</span>
                    </div>



                    <label htmlFor="ProjectmaxInvest">募资上限:</label>
                    <div className="input-group">
                        <input type="text" id="Projectgoal" ref="goal" className="form-control" placeholder="单位:以太（ETH）" aria-describedby="basic-addon2" />
                        <span className="input-group-addon" id="basic-addon2">以太(ETH)</span>
                    </div>                    
                
                </div>

                {this.state.flag ? <div className="alert alert-success">项目创建已成功</div>: <button className="btn btn-primary btn-lg" onClick={this.newProject.bind(this)}>创建项目</button>}
                
                
            </div>


        </div>
    );
  }
}

export default createProject;