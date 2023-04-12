namespace Magister

open LiteDB
open LiteDB.FSharp
open LiteDB.FSharp.Extensions

type Line 
    = Magister of string
    | User of uint64 * string

[<CLIMutable>]
type GlobalData = {
    Id : BsonValue
    lines : Line list
}

[<CLIMutable>]
type UserData = {
    Id : BsonValue
    line : string option
}

module Database = 
    let mapper = FSharpBsonMapper()
    let db = new LiteDatabase("data.db", mapper)
    let users = db.GetCollection<UserData>("users")
    let glob = db.GetCollection<GlobalData>("global")

    let private toId (id : uint64) =
         BsonValue(double id)
    let private globId = toId 0UL

    let private defaultUser (id : uint64) = {
        Id = toId id
        line = None
    }
                
    let getUser (id : uint64) =
        match users.TryFindById(toId id) with
        | Some u -> u
        | None -> defaultUser id

    let setUser (id : uint64) (data : UserData) =
        data.Id = toId id |> ignore
        users.Upsert data |> ignore
        ()

    let updateUser (id : uint64) (f : UserData -> UserData) =
        let old = getUser id
        let next = f old
        let _ = setUser id next
        next

    let getGlobal = 
        match glob.TryFindById(globId) with
        | Some g -> g
        | None -> {
            Id = globId
            lines = [
                Magister "print('hi')"
                Magister "print('bye')"
            ]}

    let setGlobal (data : GlobalData) =
        data.Id = globId |> ignore
        glob.Upsert data

    let updateGlobal (f : GlobalData -> GlobalData) =
        let old = getGlobal
        let next = f old
        setGlobal next |> ignore
        next
        

