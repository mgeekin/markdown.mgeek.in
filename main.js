const loadSkelton =()=> {
  append(app, gen(header, "header", "", "header"), "o");
  append(header, gen(nav, "nav", gen(ul,"navlist",gen(li,"",gen(a,"","Home","","/"))), "nav"));
  append(app, gen(main, "main", "", "main"));
  append(
    header,
   "",
    ""
  );

  append(app, gen(footer, "footer", "", "footer"));


  append(main,gen(section,"instructions", gen(
    h1,
    "",
    "Markdown Preview"

    )
    ,"instructions")
    )

// //howto
  append(instructions,
    gen(div,"howto","","howto")
  )
  append(howto,
    gen(p,"","To test markdown. Enter the markdown code in left side and rendered output will be shown on the right. "+
    gens(a,"","<br> Read more about markdown syntax","",{href:"https://daringfireball.net/projects/markdown/syntax",target:"_blank"})+" and this project uses "+
    gens(a,"","MathJax","",{href:"https://www.mathjax.org/",target:"_blank"})
    )
    )
// //optionbar
  append(instructions,gen(div,"optionbar","","optionbar"))
  append(optionbar,gen(span,'render',"Render","button",{onclick:"updateOutput()"}))
  append(optionbar,gen(span,'copyoutput',"Copy","button",{onclick:"copyToClipboard()"}))


  append(main, gen(section, "gridRoot", "", "gridRoot"));

  var blocks = "markdown".split(",");
  blocks.forEach((block) => {
    var id = block + "-block";
    var boxid = block + "-box";
    append(gridRoot, gen(div, id, "", block + ",column"));
    append(`#${id}`, gen(h3, "", "Markdown Input","block-heading"));
    append(`#${id}`, gen(div, `${boxid}`, "", "box"));
    append(
      `#${boxid}`,
      gen(pre, `${block}-code`, block, "code,scrolly", {
        onchange: "updateOutput()",
        contenteditable: "true",
      })
    );
  });

  var blocks = "preview".split(",");
  blocks.forEach((block) => {
    var id = block + "-block";
    append(gridRoot, gen(div, id, "", block + ",column"));
    append(`#${id}`, gen(h3, "", "Output","block-heading"));
    append(
      `#${id}`,
      gen(div, `${block}-code`, block, "code,scrolly", {
        onchange: "updateOutput()",
      })
    );
  });
}

loadSkelton()
function mathjaxUpdate() {
  console.info("mathjaxUpdate");
  // MathJax.startup.document.state(0);
  MathJax.texReset();
  MathJax.typesetClear();
  setTimeout(() => {
    // MathJax.startup.document.state(0);
    // MathJax.texReset();
    // MathJax.typesetClear();

    grab("code").forEach((c) => {
      c.innerHTML = c.innerHTML.replaceAll("<br>", "\n");
    });
    MathJax.typesetPromise();
  }, 2000);
}

function updateOutput() {
  function updatePreview(e) {
    append(`#preview-code`, e, "over");
  }
  var mdText = grab("#markdown-code")[0].innerText;
  parsemd(mdText, updatePreview);
  //    parsemdbeta(mdText, updatePreview);
  mathjaxUpdate();
}



getfile("./exampleMarkdown.md", (data) => {
  var mdExampleText = data;
  

  grab("#markdown-code")[0].innerText = mdExampleText;

  

  var mdCode = grab("#markdown-code")[0];
  mdCode.addEventListener("keypress", function (e) {
    updateOutput();

  });


  load(["./md.scss"]);
  updateOutput();

  grab("#preview-code")[0].addEventListener("dblclick", function (e) {
    var htmlPreview = grab("#preview-code")[0];
    var htmlPreviewText = htmlPreview.innerHTML
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    append("#preview-code", gen(pre, "", htmlPreviewText), "over");
  });
});

$$.loadCopyright();


//copy rendered output


async function copyToClipboard() {
  try {
    // Get the HTML element
    const element = grab(`#preview-code[0]`)
          //document.getElementById(elementId);
    if (!element) {
      console.error('Element not found');
      return false;
    }

    // Create a range and select the element's content
    const range = document.createRange();
    range.selectNode(element);

    // Clear any existing selection
    window.getSelection().removeAllRanges();
    // Add the new range
    window.getSelection().addRange(range);

    // Copy both HTML and plain text representations
    const htmlContent = element.innerHTML;
    const textContent = element.textContent || element.innerText;

    // Create a Blob with HTML content
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const textBlob = new Blob([textContent], { type: 'text/plain' });

    // Write both formats to clipboard
    const clipboardItem = new ClipboardItem({
      'text/html': htmlBlob,
      'text/plain': textBlob
    });

    await navigator.clipboard.write([clipboardItem]);
    
    console.log('Content copied to clipboard');
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  } finally {
    // Always clear the selection
    window.getSelection().removeAllRanges();
  }
}





setTimeout(
  ()=>{
  grab("#markdown-code")[0].click()
  grab("#markdown-code")[0].focus()},3000
)
