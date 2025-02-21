let boxex = document.querySelectorAll(".box");
let results = document.querySelector("#reset");
let newGameBtn = document.querySelector("#new-btn");
let msgConatiner= document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true;

const winPatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];

const resetGame = () => {
    turnO = true;
    enableBoxex();
    msgConatiner.classList.add("hide");

}

boxex.forEach((box) => {
    box.addEventListener("click",() => {
        console.log("box was clicked");
        if(turnO){
            box.innerText = "O";
            turnO = false;
        }
        else{
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true;

        checkWinner();
    });
});

const disableBoxex = () => {
    for(let box of boxex) {
        box.disabled = true;
    }
};

const enableBoxex = () => {
    for(let box of boxex) {
        box.disabled = false;
        box.innerText = "";
        }
};
const showWinner = (winner) =>{
 msg.innerText = `congratulation winner is ${winner}`;
 msgConatiner.classList.remove("hide");
 disableBoxex();
}

const checkWinner = () =>{
    for(let pattern of winPatterns){
        let pos1Val = boxex[pattern[0]].innerText;
        let pos2Val = boxex[pattern[1]].innerText;
        let pos3Val = boxex[pattern[2]].innerText;

        if(pos1Val !="" && pos2Val != "" && pos3Val !=""){
          if(pos1Val === pos2Val && pos2Val === pos3Val){
            console.log("winner",pos1Val);
            showWinner(pos1Val);
          }  
        }
}
};

newGameBtn.addEventListener("click",resetGame);
resetBtn.addEventListener("click",resetGame);