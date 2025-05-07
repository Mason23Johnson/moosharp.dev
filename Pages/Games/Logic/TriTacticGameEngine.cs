using System;
using System.Collections.Generic;
using Microsoft.JSInterop;

namespace MooSharp.Pages.Games;

public class TriTacticEngine
{
    private readonly Action<string> Output;
    private readonly Action PromptSymbol;
    private readonly Action PromptBoard;

    private string[] boardState = new string[9];
    private List<int> xPositions = new();
    private List<int> oPositions = new();
    private string player = "";
    private string computer = "";
    private string currentPlayer = "X";
    private bool gameActive = false;

    public bool AwaitingSymbol => player == "";
    public string[] Board => (string[])boardState.Clone();

    public TriTacticEngine(Action<string> output, Action promptSymbol, Action promptBoard)
    {
        Output = output;
        PromptSymbol = promptSymbol;
        PromptBoard = promptBoard;
    }

    public void Start()
    {
        Reset();
        Output("Welcome to Mason's Tri-Tactic!");
        Output("An infinite version of Tic-Tac-Toe with memory-based piece removal.");
        Output("Select X or O to begin.");
        PromptSymbol();
    }

    public void ReceiveSymbol(string symbol)
    {
        symbol = symbol.ToUpper();
        if (symbol != "X" && symbol != "O") return;

        player = symbol;
        computer = (player == "X") ? "O" : "X";
        currentPlayer = "X";
        gameActive = true;
        Output($"You are {player}. Computer is {computer}.");
        PrintBoard();
        NextTurn();
    }

    public void ReceiveMove(int index)
    {
        if (!gameActive || boardState[index] != "" || currentPlayer != player)
            return;

        PlacePiece(index, player);
        PrintBoard();

        var winner = CheckWinner();
        if (winner != null)
        {
            Output(winner == "T" ? "It's a tie!" : $"{winner} wins!");
            gameActive = false;
            return;
        }

        currentPlayer = computer;
        NextTurn();
    }

    public void Restart()
    {
        Start();
    }

    private void NextTurn()
    {
        if (!gameActive) return;

        if (currentPlayer == computer)
        {
            Output("Computer's move...");
            System.Threading.Tasks.Task.Delay(600).ContinueWith(_ =>
            {
                int move = GetComputerMove();
                PlacePiece(move, computer);
                PrintBoard();

                var winner = CheckWinner();
                if (winner != null)
                {
                    Output(winner == "T" ? "It's a tie!" : $"{winner} wins!");
                    gameActive = false;
                    return;
                }

                currentPlayer = player;
                PromptBoard();
            });
        }
        else
        {
            PromptBoard();
        }
    }

    private void PlacePiece(int index, string symbol)
    {
        if (symbol == "X")
        {
            if (xPositions.Count == 3)
            {
                int oldest = xPositions[0];
                xPositions.RemoveAt(0);
                boardState[oldest] = "";
            }
            xPositions.Add(index);
        }
        else
        {
            if (oPositions.Count == 3)
            {
                int oldest = oPositions[0];
                oPositions.RemoveAt(0);
                boardState[oldest] = "";
            }
            oPositions.Add(index);
        }
        boardState[index] = symbol;
    }

    private string? CheckWinner()
    {
        int[,] combos = new int[,]
        {
            {0,1,2}, {3,4,5}, {6,7,8},
            {0,3,6}, {1,4,7}, {2,5,8},
            {0,4,8}, {2,4,6}
        };

        for (int i = 0; i < combos.GetLength(0); i++)
        {
            int a = combos[i,0], b = combos[i,1], c = combos[i,2];
            if (boardState[a] != "" && boardState[a] == boardState[b] && boardState[b] == boardState[c])
                return boardState[a];
        }
        return null;
    }

    private int GetComputerMove()
    {
        for (int i = 0; i < 9; i++)
        {
            if (boardState[i] == "")
            {
                boardState[i] = computer;
                if (CheckWinner() == computer)
                {
                    boardState[i] = "";
                    return i;
                }
                boardState[i] = "";
            }
        }

        for (int i = 0; i < 9; i++)
        {
            if (boardState[i] == "")
            {
                boardState[i] = player;
                if (CheckWinner() == player)
                {
                    boardState[i] = "";
                    return i;
                }
                boardState[i] = "";
            }
        }

        Random rand = new();
        int move;
        do move = rand.Next(9); while (boardState[move] != "");
        return move;
    }

    private void PrintBoard()
    {
        string[] b = boardState;
        Output($"\n {Cell(0)} | {Cell(1)} | {Cell(2)}\n---+---+---\n {Cell(3)} | {Cell(4)} | {Cell(5)}\n---+---+---\n {Cell(6)} | {Cell(7)} | {Cell(8)}\n");
    }

    private string Cell(int i) => boardState[i] == "" ? (i + 1).ToString() : boardState[i];

    private void Reset()
    {
        for (int i = 0; i < 9; i++) boardState[i] = "";
        xPositions.Clear();
        oPositions.Clear();
        player = "";
        computer = "";
        gameActive = false;
    }
}
