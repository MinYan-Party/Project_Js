/**
 * Paging V1.0.0 -- Jquery MinYan-Party Paging Plugin 分页
 * 2016/11/18
 * MinYan-Party
 */
(function ($) {
    function Paging(target, option) {
        this.options = option;
        this.container = $(target);
        this.init();
    };
    Paging.prototype.init = function() {
        this.ul = $('<ul class="'+this.options.position+'"></ul>');
        this.container.html(this.ul);

        var pageData = {page:this.options.pageSet.page,totalNum:this.options.totalNum};
        this.setData(pageData);

        this.ul.find("li:not('.backPage'):eq("+(this.options.pageSet.page-1)+")").trigger('click');
    };

    Paging.prototype.setData = function(pageData) {
        var $this = this;
        if(!pageData){
            $this.container.hide();
            return;
        }
        if(typeof pageData.page == 'undefined' || pageData.page == 0)pageData.page=1;
        $this.options.pageSet.page = parseInt(pageData.page);
        $this.options.pageSet.totalpage=Math.ceil(parseInt(pageData.totalNum) / $this.options.num);

        $this.ul.find("*").remove();

        var num = 10;
        $this.ul.append("<li class='"+($this.options.pageSet.page > 1?"enable":"disable")+"' name='"+($this.options.pageSet.page-1)+"'>上一页</li>");

        if($this.options.pageSet.totalpage<=num){
            for(var i=1;i<=$this.options.pageSet.totalpage;i++){
                if(i==$this.options.pageSet.page){
                    $this.ul.append('<li class="active" name="'+$this.options.pageSet.page+'">'+$this.options.pageSet.page+'</li>');
                }else{
                    $this.ul.append('<li class="enable" name="'+i+'">'+i+'</li>');
                }
            }
        }else{
            if($this.options.pageSet.page<7){
                for(var i=1;i<=7;i++){
                    if(i==$this.options.pageSet.page){
                        $this.ul.append('<li class="active" name="'+$this.options.pageSet.page+'">'+$this.options.pageSet.page+'</li>');
                    }else{
                        $this.ul.append('<li class="enable" name="'+i+'">'+i+'</li>');
                    }
                }
                $this.ul.append('<li>...</li>');
                for(var i=$this.options.pageSet.totalpage-1;i<=$this.options.pageSet.totalpage;i++){
                    $this.ul.append('<li class="enable" name="'+i+'">'+i+'</li>');
                }
            }else if($this.options.pageSet.page+3>=$this.options.pageSet.totalpage){
                for(var i=1;i<=3;i++){
                    $this.ul.append('<li class="enable" name="'+i+'">'+i+'</li>');
                }
                $this.ul.append('<li>...</li>');
                var centerMax=0;
                for(var i=$this.options.pageSet.page-(5-($this.options.pageSet.totalpage-$this.options.pageSet.page));i<=$this.options.pageSet.page+2;i++){
                    if(i<=$this.options.pageSet.totalpage){
                        if(i==$this.options.pageSet.page){
                            $this.ul.append('<li class="active" name="'+$this.options.pageSet.page+'">'+$this.options.pageSet.page+'</li>');
                        }else{
                            $this.ul.append('<li class="enable" name="'+i+'">'+i+'</li>');
                        }
                        centerMax = i;
                    }
                }
                if(centerMax<$this.options.pageSet.totalpage){
                    $this.ul.append('<li class="enable" name="'+$this.options.pageSet.totalpage+'">'+$this.options.pageSet.totalpage+'</li>');
                }
            }else {
                for(var i=1;i<=2;i++){
                    $this.ul.append('<li class="enable" name="'+i+'">'+i+'</li>');
                }
                $this.ul.append('<li>...</li>');
                var centerMax=0;
                for(var i=$this.options.pageSet.page-2;i<=$this.options.pageSet.page+2;i++){
                    if(i<=$this.options.pageSet.totalpage){
                        if(i==$this.options.pageSet.page){
                            $this.ul.append('<li class="active" name="'+$this.options.pageSet.page+'">'+$this.options.pageSet.page+'</li>');
                        }else{
                            $this.ul.append('<li class="enable" name="'+i+'">'+i+'</li>');
                        }
                        centerMax = i;
                    }
                }
                if(centerMax<$this.options.pageSet.totalpage){
                    $this.ul.append('<li>...</li>');
                    $this.ul.append('<li class="enable" name="'+$this.options.pageSet.totalpage+'">'+$this.options.pageSet.totalpage+'</li>');
                }
            }
        }

        $this.ul.append('<li class="'+($this.options.pageSet.page < $this.options.pageSet.totalpage?"enable":"disable")+'" name="'+($this.options.pageSet.page+1)+'">下一页</li>');

        var ulWidth = 0;
        $this.ul.find("li").each(function(){
            ulWidth += this.clientWidth;
        });
        $this.ul.css('width',(ulWidth+$this.ul.find("li").length-1)+'px');

        $this.ul.find("li:not('.backPage')").click($this, function(event){
            event.data.options.itemClick($(this).attr("name"), $this);
            $(window).scrollTop(0);
        });

    };

    Paging.defaultOption = {
        pageSet:{
            totalpage:1,	//总页数
            page:1			 //当前页
        },
        totalNum:1,      //总记录数
        num:10,				   //显示行数
        position:'left',  //显示位置,可选参数 center、left、right
        itemClick:function(page,obj){

        }
    };
    $.fn.paging = function(option, param){

        var options = typeof option == 'object' && option;

        options = $.extend(true, {}, Paging.defaultOption, options);

        var paging = new Paging(this, options);
    };
    $.fn.paging.Constructor = Paging;
})(jQuery);
