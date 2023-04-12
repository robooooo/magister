namespace Magister

open System.Threading.Tasks
open System.IO
open DSharpPlus
open DSharpPlus.Entities
open DSharpPlus.CommandsNext
open DSharpPlus.SlashCommands
open Database

module Utils = 
    let guild = 1095214570013990914UL
    let tome = 1095489773726072962UL

    let updateTome (discord : DiscordClient) = task {
        let glob = getGlobal
        // The resulting file is based on the lines given, with comments added describing line origin
        let prelude = [
            "# DIVINE TOME OF THE MAGISTERIUM -- FOR INITIATED MINDS ONLY!"
            "# The power within binds the mind of the peonic."
            "# Cast out thy power, and thy will shall find its place in this tome."
            "# ... specifically, /cast <n> <line> will place <line> immediately after line <n> herein."
            "# Be warned! The mortal soul has only power for one line, so this will replace your old contribution."
            ""
            ""
            ""
        ]
        let pad n = 
            let padLen = glob.lines.Length.ToString().Length
            n.ToString().PadRight(padLen, ' ')
        let content =
            glob.lines
            |> List.mapi (fun i l -> 
                match l with
                | Magister line -> [
                    $"# {pad i} DECREED BY DIVINE PROVIDENCE"
                    line
                    ]
                | User(user, line) -> [
                    $"# {pad i} Instituted by user {user}"
                    line
                    ]
            )
            |> List.concat
            |> List.append prelude
        
        let! channel = discord.GetChannelAsync tome
        let! lastMessages = channel.GetMessagesAsync 1
        do! match Seq.tryHead lastMessages with
            | Some(lm) -> lm.DeleteAsync()
            | None -> Task.CompletedTask


        let tempFile = "temp.txt"
        // This filestream buisiness is annoying!
        content 
            |> List.fold (fun st ln -> $"{st}\n{ln}") ""
            |> fun s -> File.WriteAllText(tempFile, s)
        use stream = new FileStream(tempFile, FileMode.Open)


        let builder = new DiscordMessageBuilder()
        builder.set_Content "**Behold!**"
        builder.AddFile(stream) |> ignore

        let! _ = channel.SendMessageAsync(builder)
        File.Delete(tempFile)
    }