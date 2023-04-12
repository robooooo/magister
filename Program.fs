module Main

open System.Threading.Tasks
open DSharpPlus
open DSharpPlus.CommandsNext

let token = File.Open()

[<EntryPoint>]
let main argv = 
    discord.ConnectAsync() |> Async.AwaitTask |> Async.RunSynchronously
    Task.Delay(-1) |> Async.AwaitTask |> Async.RunSynchronously
    0