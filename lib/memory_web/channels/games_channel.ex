defmodule MemoryWeb.GamesChannel do
	use MemoryWeb, :channel

	alias Memory.Game

	def join("games:" <> name, payload, socket) do
		if authorized?(payload) do
			game = Memory.GameBackup.load(name) || Game.new()
			socket = socket
			|> assign(:game, game)
			|> assign(:name, name)
			{:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
		else
			{:error, %{reason: "unauthorized"}}
		end
	end

	def handle_in("toggle", %{"idx" => idx}, socket) do
		game = Game.toggle(socket.assigns[:game], idx)
		Memory.GameBackup.save(socket.assigns[:name], game)
		socket = assign(socket, :game, game)
		{:reply, {:ok, %{ "game" => game}}, socket}
	end

	def handle_in("new", socket) do
		game = Game.new()
		Memory.GameBackup.save(socket.assigns[:name], game)
		socket = assign(socket, :game, game)
		{:reply, {:ok, %{"game" => game}}, socket}
	end

	defp authorized?(_payload) do
		true
	end
end
