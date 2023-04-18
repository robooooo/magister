namespace Magister

open System.Threading.Tasks
open System.IO
open DSharpPlus
open DSharpPlus.CommandsNext
open DSharpPlus.SlashCommands
open Database
open Utils
open CliWrap
open System.Text

module Commands = 
    type MagisterCommands() =
        inherit ApplicationCommandModule()

        [<SlashCommand("refresh", "Refresh your memory of the tome.")>]
        member public self.Refresh (ctx: InteractionContext) = task {
            do! ctx.CreateResponseAsync(
                content = "It is done.",
                ephemeral = true
            )
            do! updateTome ctx.Client
        }

        [<SlashCommand("cast", "Using a thread of your willpower, exert control on the peon.")>]
        member public self.Cast(
            ctx: InteractionContext, 
            [<Option("line", "Your wish will be inserted after this line.")>] lineNo : int64, 
            [<Option("wish", "A line of great Power that shall control the peon.")>] line : string
        ) = task {
            let userId = ctx.User.Id


            let checkFile = "check.js"
            // Get a perspective next tome
            let newTome = buildTome (int lineNo) line userId
            // Check if the code is syntactically correct, just as a baseline sanity check 
            File.WriteAllLines(checkFile, Seq.map lineString newTome)
            let mutable sb = new StringBuilder()
            let! res = Cli.Wrap("node")
                          .WithArguments(["--check"; checkFile])
                          .WithStandardOutputPipe(PipeTarget.ToStringBuilder sb)
                          .WithStandardErrorPipe(PipeTarget.ToStringBuilder sb)
                          .WithValidation(CommandResultValidation.None)
                          .ExecuteAsync()
            if res.ExitCode = 0 then
                do! ctx.CreateResponseAsync(
                    content = $"You cast forward a tendril of your power, and the <#{tome}>'s pages flip!", 
                    ephemeral = true
                )
                // Rebuild the tome
                updateGlobal_ (fun glob -> { glob with lines = newTome })
                do! updateTome ctx.Client
            else
                // Report error message, why didn't this work?
                do! ctx.CreateResponseAsync(
                    content = $"The tome stays dormant in your hands, and you hear laughter...\n```{sb}```",
                    ephemeral = true
                )
        }