# dubdiff

A diff viewer for markdown-formatted documents. 

Uses the [`wdiff`](http://www.gnu.org/software/wdiff/) tool as a diffing engine. This produces an output that is more useful for copy-editing tasks. This wdiff comparison is then processed in a way that is aware of markdown formatting. The resulting output attempts to show differences of copy within the final document format (rather than differences of format).

The markdown-sensitive processing of the wdiff comparison is at `server/components/wdiff/index.js`, for the curious.


## Live Version

The tool is live at [http://dubdiff.com], feel free to use it there.
