namespace Magister

open System.IO
open FSharp.Json

type Line 
    = Magister of string
    | User of uint64 * string

type GlobalData = {
    lines : Line list
}

module Database = 
    let private globalPath = "global"

    let jsonPath file = "./json/" + file + ".json"
    let lineString = function
    | Magister s -> s
    | User(_, s) -> s

    let private scaffoldLines = 
        File.ReadAllLines("scaffold.js")
        |> Seq.map(Magister)
        |> Seq.toList

    let getGlobal = 
        let path = jsonPath globalPath
        if File.Exists path then 
            File.ReadAllText path |> Json.deserialize
        else
            printfn "Generating new %s!" path
            { lines = scaffoldLines }

    let setGlobal (data : GlobalData) =
        File.WriteAllText(jsonPath globalPath, Json.serialize data)

    let updateGlobal (f : GlobalData -> GlobalData) =
        let old = getGlobal
        let next = f old
        setGlobal next |> ignore
        next

    let updateGlobal_ f = ignore (updateGlobal f)
        

