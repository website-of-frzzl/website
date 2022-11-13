$(document).ready(function(){

  
  function redirect(loc) {
    window.location.href = '/' + loc;
  }

  $(".flag").keyup(function(e){
    if (e.keyCode == 13) {
      $(this).click();
    }
  })
    
    $(".flag").click(async function(){

      $(this).attr("class","selected flag");

      $("#flags").css("transform", "none");

      let newFlag = $(this).clone().appendTo("#wrap");
      newFlag.css({"position": "absolute"});
      let pos = $(this).offset();
      newFlag.css({"top": pos.top + 14.5, "left":pos.left + 14.5, "transform": "rotate(-45deg)"})

      $("#flags").css("transform", "rotate(-45deg)");
      $(".flag").not(this).css("opacity", "0");
       
      await new Promise(resolve => setTimeout(resolve, 750));
      $("#flags").remove()

      document.querySelector(':root').style.setProperty("--x", `${pos.left + 14.5}px`);
      document.querySelector(':root').style.setProperty("--y", `${pos.top + 14.5}px`);
      newFlag.css({"opacity": "1"}).addClass("move");

      await new Promise(resolve => setTimeout(resolve, 2250));
      newFlag.fadeOut()
      await new Promise(resolve => setTimeout(resolve, 1000));

      redirect(this.id);
    });
  });

