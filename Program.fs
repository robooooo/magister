namespace Magister

open System.Threading.Tasks
open System.IO
open DSharpPlus
open DSharpPlus.CommandsNext
open DSharpPlus.SlashCommands
open Commands
open Utils

module Program = 
    let token = 
        File.ReadLines("tokens.txt")
        |> Seq.head

    let conf = new DiscordConfiguration()
    conf.set_AutoReconnect true
    conf.set_Token token
    conf.set_TokenType TokenType.Bot

    let discord = new DiscordClient(conf)

    let slash = discord.UseSlashCommands()
    slash.RegisterCommands<MagisterCommands>(guild)
    slash.add_SlashCommandErrored (fun ctx e -> task {
        System.Console.WriteLine(e.Exception.ToString())
        return ()
    })

    [<EntryPoint>] 
    let main _ = 
        discord.ConnectAsync() |> Async.AwaitTask |> Async.RunSynchronously
        Task.Delay(-1) |> Async.AwaitTask |> Async.RunSynchronously
        0 