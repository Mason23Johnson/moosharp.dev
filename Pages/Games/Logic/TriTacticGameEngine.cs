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
    private readonly List<string> logLines = new();

    public bool AwaitingSymbol => player == "";
    public bool IsPlayerTurn => gameActive && currentPlayer == player;
    public bool GameOver => !gameActive && player != "";
    public string[] Board => (string[])boardState.Clone();
    public IReadOnlyList<string> LogLines => logLines.AsReadOnly();

    public TriTacticEngine(Action<string> output, Action promptSymbol, Action promptBoard)
    {
        Output = output;
        PromptSymbol = promptSymbol;
        PromptBoard = promptBoard;
    }

    public void Start()
    {
        Reset();
        WriteLine("Welcome to Mason's Tri-Tactic!");
        WriteLine("An infinite version of Tic-Tac-Toe with memory-based piece removal.");
        WriteLine("Select X or O to begin.");
        PromptSymbol();
    }

    public bool ReceiveSymbol(string symbol)
    {
        symbol = symbol.ToUpper();
        if (symbol != "X" && symbol != "O") return false;

        player = symbol;
        computer = (player == "X") ? "O" : "X";
        currentPlayer = "X";
        gameActive = true;
        WriteLine($"You are {player}. Computer is {computer}.");
        WriteLine("Use the board below or press 1-9 on your keyboard to make a move.");
        NextTurn();
        return true;
    }

    public bool ReceiveMove(int index)
    {
        if (!gameActive || boardState[index] != "" || currentPlayer != player)
            return false;

        PlacePiece(index, player);

        var winner = CheckWinner();
        if (winner != null)
        {
            WriteLine(winner == "T" ? "It's a tie!" : $"{winner} wins!");
            gameActive = false;
            return true;
        }

        currentPlayer = computer;
        NextTurn();
        return true;
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
            WriteLine("Computer's move...");
            _ = RunComputerTurnAsync();
        }
        else
        {
            PromptBoard();
        }
    }

    private async Task RunComputerTurnAsync()
    {
        await Task.Delay(600);

        if (!gameActive || currentPlayer != computer)
            return;

        int move = GetComputerMove();
        PlacePiece(move, computer);

        var winner = CheckWinner();
        if (winner != null)
        {
            WriteLine(winner == "T" ? "It's a tie!" : $"{winner} wins!");
            gameActive = false;
            PromptBoard();
            return;
        }

        currentPlayer = player;
        PromptBoard();
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

    private void Reset()
    {
        for (int i = 0; i < 9; i++) boardState[i] = "";
        xPositions.Clear();
        oPositions.Clear();
        logLines.Clear();
        player = "";
        computer = "";
        gameActive = false;
    }

    private void WriteLine(string message)
    {
        logLines.Add(message);
        Output(message);
    }
}
