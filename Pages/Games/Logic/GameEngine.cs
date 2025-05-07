public class GameEngine
{
    private readonly Action<string> Output;
    private readonly Action RequestInput;
    private string playerSymbol = "X";
    private string[] board = new string[9];

    public GameEngine(Action<string> output, Action requestInput)
    {
        Output = output;
        RequestInput = requestInput;
    }

    public void Start()
    {
        Output("Welcome to Mason's Tri-Tactic!");
        Output("Do you want to play as X or O?");
        RequestInput();
    }

    public void ReceiveInput(string input)
    {
        // handle game logic here, continue output + input loop
        // ...
    }
}
