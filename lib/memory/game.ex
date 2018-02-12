defmodule Memory.Game do

	def new() do
		%{
			clicks: 0,
			moveOne: -1,
			moveTwo: -1,
			matched: [],
			cards: shuffle_cards()
		}
	end


	def client_view(game) do
		%{
			clicks: game.clicks,
			cards: game.cards,
			moveOne: game.moveOne,
			moveTwo: game.moveTwo,
			matched: game.matched
		}
	end

	def shuffle_cards() do
		["A", "A", "B", "B", "C", "C", "D", "D", 
		"E", "E", "F", "F", "G", "G", "H", "H"]
		|> Enum.shuffle()
	end

	def toggle(game, idx) do
		cond do
			game.moveOne == -1 ->
				%{
					clicks: game.clicks + 1,
					moveOne: idx,
					matched: game.matched,
					cards: game.cards,
					moveTwo: game.moveTwo
				}
			game.moveTwo == -1 ->
				if Enum.at(game.cards, game.moveOne) == Enum.at(game.cards, idx) do
					matched = game[:matched] ++ [Enum.at(game.cards, idx)]
					%{
					 	matched: matched,
					 	clicks: game.clicks + 1	,
					 	cards: game.cards,
					 	moveOne: -1,
					 	moveTwo: -1	

					}
				else
					%{
						moveOne: -1,
						moveTwo: -1,
						clicks: game.clicks + 1,
						cards: game.cards,
						matched: game.matched
					}
				end			
			true -> game
		end
	end
end 
