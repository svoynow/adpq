{:ok, _} = Application.ensure_all_started(:ex_machina)
ExUnit.configure formatters: [JUnitFormatter, ExUnit.CLIFormatter]
ExUnit.start(exclude: [:skip])

Ecto.Adapters.SQL.Sandbox.mode(Adpq.Repo, :manual)
