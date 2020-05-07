pragma solidity ^0.4.22;

/** 
* @title SafeMath 
* @dev Math operations with safety checks that throw on error 
*/ 
library SafeMath { 
    function mul(uint a, uint b) internal pure returns (uint) { 
        uint c = a * b; 
        assert(a == 0 || c / a == b); 
        return c;
    }
    function div(uint a, uint b) internal pure returns (uint) { 
        // assert(b > 0); // Solidity automatically throws when dividing by 0 
        uint c = a / b; 
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold 
        return c; 
    } 
    function sub(uint a, uint b) internal pure returns (uint) { 
        assert(b <= a); 
        return a - b; 
    } 
    function add(uint a, uint b) internal pure returns (uint) { 
        uint c = a + b; 
        assert(c >= a); 
        return c; 
    } 
}

contract ProjectList{
    using SafeMath for uint;
    address[] public projectAddrs;
    
    function createProject(string _desc,uint _minInvest,uint _maxInvest,uint _goal) public {
       address projectAdr = new Project(msg.sender,_desc,_minInvest,_maxInvest,_goal);
        projectAddrs.push(projectAdr);
    }
    
    function getProjects() view public returns(address[]){
        return projectAddrs;
    }
}




contract Project{
    using SafeMath for uint;
    /**
    资金的支出目的
    具体的金额
    接收人是谁
    是否已经募资完成|项目完成|投票是否已经
    投票的股东有哪些
    **/
    struct Payment{
        string desc;
        uint amount;
        address recevier;
        bool completed;
        mapping(address=>bool) voters; 
        uint voteCount;
    }
    //1.项目的发起人
    address public owner;
    //2.项目的描述(ipfs url)
    string public description;
    //3.最小的投资金额
    uint public minInvest;
    //4.最大的投资金额
    uint public maxInvest;
    //5.项目上限
    uint public goal;
    //6.投资人列表，就是哪些人投了钱
    mapping(address=>uint) investors;
    uint investorCount;
    //7.资金的列表
    Payment[] public paymentList;
    //项目初始化的构造
    constructor(address _owner,string _desc,uint _minInvest,uint _maxInvest,uint _goal) public {
        owner = _owner;
        description = _desc;
        minInvest = _minInvest;
        
        maxInvest = _maxInvest;
        goal = _goal;
    }
    
    modifier MustContractCreator(){
        require(owner==msg.sender,"must be creator of contract");
        _;
    }
    
    //投资
    function contribute() payable public {
        require(msg.value>=minInvest,"must be greate than minInvest of value");
        require(msg.value<=maxInvest,"must be less equl than maxInvest of value");
        //uint newResult = address(this).balance + msg.value;
        uint newResult = 0 ;
        newResult = address(this).balance.add(msg.value);
        require( newResult<= goal,"can not beyond goal");
        investors[msg.sender] = msg.value;
        investorCount+=1;
    }
    
    //构造项目资金的请求
    function createPayment(string _desc,uint _amount,address _recevier) public MustContractCreator {
        
        Payment memory payment = Payment({
            desc:_desc,
            amount:_amount,
            recevier:_recevier,
            completed:false,
            voteCount:0
        });
        
        paymentList.push(payment);
        
    }
    //投票功能
    function approvePayment(uint index) public {
         Payment storage payment = paymentList[index];
         require(!payment.completed,"current payment has been finished");
         require(!payment.voters[msg.sender],"can't vote twice");
         payment.voters[msg.sender] = true;
         payment.voteCount += 1;
    }
    //股东是否答应和投票通过资金输出
    function doPayment( uint index ) public MustContractCreator {
        Payment storage payment = paymentList[index];
        require(!payment.completed,"current payment has been finished");
        require( address(this).balance>=payment.amount,"balance must be ok" );
        require( payment.voteCount > (investorCount/2),"must be greate than 1/2 of investors"    );
        
        payment.recevier.transfer( payment.amount );
        payment.completed = true;
        
    }
    
    function getSummary() view  public returns(string,uint,uint,uint,uint,uint,uint,address){
        return(
            description,
            minInvest,
            maxInvest,
            goal,
            address(this).balance,
            investorCount,
            paymentList.length,
            owner
        );
    }
     //直接把钱圈走  
    function doEther() public MustContractCreator{
        owner.transfer(address(this).balance);
    }

    function() payable public{}
    
    
}