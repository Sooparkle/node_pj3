const express = require('express');
const fetch = require("node-fetch");
const bodyParaser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParaser.json());


//사용자 테스트 페이지
app.get('/', async(req, res)=>{
  if(res.status(200)){
    res.send('<h1>데이터 통신 성공</h>');
  } else {
    res.status(404).send('서버 오류')
  }
})



// 네이버 Social Media 로그인 
var client_id = 'jZqFNn5osrqKbmxXtvZw';
var client_secret = 'n5VpdIgn1r';
var state = "RANDOM_STATE-anyword";
var redirectURI = encodeURI("http://localhost:3000/callback");
var api_url = "";


app.get("/naverlogin", async function (req, res) {
  api_url =
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
    client_id +
    "&redirect_uri=" +
    redirectURI +
    "&state=" +
    state;

    const response = fetch(api_url, )
  res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  res.end(
    "<a href='" +
      api_url +
      "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>"
  );
});




app.get("/callback", async function (req, res) {
  const code = req.query.code;
  const state = req.query.state;
  const api_url =
    "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=" +
    client_id +
    "&client_secret=" +
    client_secret +
    "&redirect_uri=" +
    redirectURI +
    "&code=" +
    code +
    "&state=" +
    state;

    const response = await fetch(api_url, {
      headers: {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
      },
    });
  
    const tokenRequest = await response.json();
    
    if ("access_token" in tokenRequest) {
      const { access_token } = tokenRequest;
      const apiUrl = "https://openapi.naver.com/v1/nid/me";
  
      const data = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
  
      const userData = await data.json();
  
      //사용자 정보 콘솔로 받아오기 -> DB에 저장해야 합니다.
      console.log("userData:", userData);
    }
  
    return res.send("DB에 저장하고 랜드페이지로 redirect ");
  });



// const images = []

// app.post('/naverbooks', async(req, res)=>{
//   console.log("Data", req.body)
//   const book = req.body.book

//     //   res.json({ // Return JSON object with the book
//     //     message: "okay?! from a node",
//     //     book: book,
//     // });

  
// try{
//   const naverUrl = new URL('https://openapi.naver.com/v1/search/book.json');
//   naverUrl.searchParams.set('query', book);
//   naverUrl.searchParams.set('display', 1);

//   const options ={
//     method : 'GET',
//     headers : {
//       'Content-Type': 'application/json',
//       'X-Naver-Client-Id': 'ytaQUUoLOhwBVF3BCR1m',
//       'X-Naver-Client-Secret': 'FQqOQ31UUj'
//     }
//   };
//   const response = await fetch(naverUrl.toString(), options);

//   // console.log("FetchBookImage function", response);

//   if(!response.ok){
//     throw new Error (`Naver API fetch failed ${response.status}`)
//   }

//   const data = await response.json();
//   console.log("Response URL", data.items[0].image);

//   images.push({
//     title : data.items[0].tittle,
//     imageURL : data.items[0].image,
//   })
//   // res.json(images);
  
// } catch(error) {
//   console.log("Error fetching data at Node", error)
// };

// })

// console.log("BookUrl List", images)



app.listen(port, ()=>{
  console.log(`http://localhost:${port} Let get the hell` )
})