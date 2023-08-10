using System.Text;
using PhotinoNET;
using PhotinoNET.Server;

namespace Photino.HelloPhotino.StaticFileServer;

class Program
{
    [STAThread]
    public static void Main(string[] args)
    {
        //PhotinoServer.CreateStaticFileServer(args, out string baseUrl).RunAsync();
        string windowTitle = "EscargotSpace";
        var window = new PhotinoWindow()
            .SetTitle(windowTitle)
            .Center()
            .SetResizable(false)
            .RegisterWebMessageReceivedHandler(
                (object sender, string message) =>
                {
                    var window = (PhotinoWindow)sender;
                    string response = $"Received message: \"{message}\"";
                    window.SendWebMessage(response);
                }
            )
            /* Disable Cors */

            /* Disable context menu */
            .SetContextMenuEnabled(true)
            .Load($"data/index.html");
        //.LoadRawString("<h3> test <h3>");
        window.WaitForClose();
    }
}
