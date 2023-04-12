namespace Magister

open System.Threading.Tasks
open System.IO
open DSharpPlus
open DSharpPlus.CommandsNext
open DSharpPlus.SlashCommands
open Database
open Utils

module Commands = 
    type MagisterCommands() =
        inherit ApplicationCommandModule()

        [<SlashCommand("cast", "Using a thread of your willpower, exert control on the peon.")>]
        member public self.Cast(
            ctx: InteractionContext, 
            [<Option("line", "Your wish will be inserted after this line.")>] lineNo : int64, 
            [<Option("wish", "A line of great Power that shall control the peon.")>] line : string
        ) = task {
            let userId = ctx.User.Id
            do! ctx.CreateResponseAsync(
                content = $"You cast forward a tendril of your power, and the <#{tome}>'s pages flip!", 
                ephemeral = true
            )

            // Update global data to remove previous line and add current line
            let _ = updateGlobal (fun data -> 
                // We insert first so we don't have to modify line numbers
                // Insert with the special userId 0, then we change it after
                let updated = 
                    data.lines 
                        |> List.insertAt (int lineNo) (User(0UL, line))
                        |> List.where (function
                            | Magister _ -> true
                            // False (evict) if equal to user
                            | User(u, _) -> userId <> u
                        )
                        |> List.map (fun l -> 
                            match l with
                            | Magister _ -> l
                            | User(0UL, s) -> User(userId, s)
                            | User(_, _) -> l
                        ) 
                let _ = (data.lines = updated)
                data
            )

            // Update the users line, adding the thing
            let _ = updateUser userId (fun data ->
                data.line = Some line |> ignore
                data
            )

            // Rebuild the tome
            do! updateTome ctx.Client

        }