import dbConnect from "@/dbConnect/db";
import { NextResponse } from "next/server";

export async function GET(req){
  try{
    const result = await dbConnect()
    console.log(result)
    return NextResponse.json( { message : "Database connected " } , 
      {
        status : 200 ,
        headers : { "content-Type" : "application/json"}
      }
    )
  }
  catch(error){
    console.error(error);
     return NextResponse.json( { message : "failed connected " } , 
      {
        status : 401 ,
        headers : { "content-Type" : "application/json"}
      }
    )
  }
}