/**
 * Validate V1.0.0 -- Jquery MinYan-Party Validate Plugin 表单验证
 * 2016/11/29
 * MinYan-Party
 */
(function($){
	function Validate(target, option) {
		this.options = option;
		this.container = $(target);
	};

	Validate.prototype = {
		init:function(){
			var $this = this;
			var error = 0;
			for(var d in $this.options.rule){
				var o = $this.container.find(':input[name="'+d+'"]');  //key取对象
				if(o.length==0){
					console.log(d+'不存在.');
					return false;
				}
				var r = $this.options.rule[d];  //取规则
				if(!$this.checkValue(r,o))
					error++;
				$this.bindEvent(r,o);
			}
			return error>0?false:true;
		},
		checkValue:function(rule,obj){
			var check = true;
			var $this = this;
			if(typeof rule == 'string'){
				check = $this.ruleCheck(rule,true,obj);
			}else if(typeof rule == 'object'){
				for(var d in rule){
					check = $this.ruleCheck(d,rule[d],obj);
					if(!check)
						break;
				}
			}
			return check;
		},
		ruleCheck:function(k,v,obj){
			var $this = this;
			var check = true;
			var value;
			var initValue;
			try{
				value = $.trim(obj.val());
				initValue = obj.val();
			}catch(e){
				console.log('校验对象出错');
				console.log(e);
				return false;
			}
			switch(k){
				case 'space':
					if(initValue==''){
						$this.hideError(obj);
					}else{
						var space = /\s+/;
						if(space.test(initValue)){
							$this.showError(obj,k);
							check = false;
						}else{
							$this.hideError(obj);
						}
					}
					break;
				case 'required':
					if(obj.attr('type')=='checkbox'){
						var isCheck = false;
						obj.each(function(){
							if($(this).attr('checked')){
								isCheck = true;
								return false;
							}
						});
						if(isCheck){
							$this.hideError(obj);  //多个
						}else{
							$this.showError(obj,k);
							check = false;
						}
					}else{
						if(v && (value==null || value == '')){
							$this.showError(obj,k);
							check = false;
						}else{
							$this.hideError(obj);
						}
					}
					break;
				case 'remote':
					if(value==''){
						$this.hideError(obj);
					}else{
						$.ajax({
							type:'post',
							url:v.url,
							data:v.data,
							dataType:'json',
							async:false,
							success:function(data){
								if(data.success){
									$this.hideError(obj);
								}else{
									$this.showError(obj,data.msg);
									check = false;
								}
							}
						});
					}
					break;
				case 'username':  //字符合法性验证 中英文、数字、下划线
					var char = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
					if(value=='' || char.test(value)){
						$this.hideError(obj);
					}else{
						$this.showError(obj,k);
						check = false;
					}
					break;
				case 'loginname': //字符合法性验证 英文、数字、下划线
					var char = /^[a-zA-Z0-9_]+$/;
					if(value=='' || char.test(value)){
						$this.hideError(obj);
					}else{
						$this.showError(obj,k);
						check = false;
					}
					break;
				case 'parent':    //满足父级条件时必选
					for(var d in v){
						var rv = $this.container.find(':input[name="'+d+'"]').val();
						if(rv==v[d] && (value==null || value == '')){
							$this.showError(obj,obj.attr('name')+'_'+k);
							check = false;
							break;
						}else{
							$this.hideError(obj);
						}
					}
					break;
				case 'minlength':
					if(value=='' || value.length<v){
						$this.showError(obj,k,v);
						check = false;
					}else{
						$this.hideError(obj);
					}
					break;
				case 'maxlength':
					if(value.length>v){
						$this.showError(obj,k,v);
						check = false;
					}else{
						$this.hideError(obj);
					}
					break;
				case 'number':
					var number = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;
					if(value=='' || number.test(value)){
						$this.hideError(obj);
					}else{
						$this.showError(obj,k);
						check = false;
					}
					break;
				case 'email':
//					var email = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
					var email = /\w+[@]{1}\w+[.]\w+/;
					if(value=='' || email.test(value)){
						$this.hideError(obj);
					}else{
						$this.showError(obj,k);
						check = false;
					}
					break;
				case 'phone':
					var mobile = /^1[3|4|5|7|8]\d{9}$/;
//					var tel = /^\d{3,4}-?\d{7,9}$/;
					if(value=='' || mobile.test(value)){
						$this.hideError(obj);
					}else{
						$this.showError(obj,k);
						check = false;
					}
					break;
				default:
					break;
			}
			return check;
		},
		bindEvent:function(r,o){
			var $this = this;
			o.off('blur');
			o.on('blur',function(){
				$this.checkValue(r,$(this));
			});
			o.off('keyup');
			o.on('keyup',function(){
				$this.checkValue(r,$(this));
			});
		},
		showError:function(obj,msg,v){
			var $this = this;
			var tip = $('#'+obj.attr('name')+'Tip');  //获取提示显示区域
			var value = typeof v == 'undefined'?'':v;
			var showMsg = typeof $this.options.message[msg] == 'undefined'?msg:$this.options.message[msg];
			if(tip.length){  //如果已经存在提示显示区域 ， 直接向该区域添加新提示
				$('#'+obj.attr('name')+'Tip').html(showMsg+value);
			}else{ //如果不存在则添加新提示区
				tip = $('<label class="tip" id="'+obj.attr('name')+'Tip">'+showMsg+value+'</label>');
        obj.after(tip);

        //此处也是我在我的项目中用到的，如果有需要改样式，或改提示样式的可以修改此处代码。
        /*
				tip.append('<label class="error" style="display: inline-block;">'+showMsg+value+'</label>');
				tip.append('<img src="images/zx_tipPic.png" height="10" width="13" alt="" class="tipPic"/>');
				if(obj.attr('type')=='checkbox'){
					obj.parents('div:eq(0)').prepend(tip);
				}else{
					if(obj.parent().hasClass('right')){
						obj.parent().after(tip);
					}else{
						obj.after(tip);
					}
				}
        */
			}

      //以下是我在项目中使用插件时，由于样式冲突等问题造成的提示显示位置不对时进行的一些提示位置调整，如果前端样式写的好的话，一般不会出现这种问题
      /*
      if(obj.attr('type')=='checkbox'){
				var offset = obj.parents('div:eq(0)').offset();
				var left = offset.left+obj.parents('div:eq(0)').width()-tip.width()+7;
				tip.css('left',left+'px');
				tip.css('margin-top','-34px');
			}else{
				var offset = obj.offset();
				var left = offset.left+obj.width()-tip.width()+7;
				tip.css('left',left+'px');
				if(obj.parents('.search_bar').length){
					tip.css('margin-top','-33px');
				}else{
					if(obj[0].tagName=='TEXTAREA'){
						tip.css('margin-top','-32px');
					}else if(obj[0].tagName=='SELECT'){
						tip.find('.tipPic').css('marginBottom','1px');
						tip.css('margin-top','-71px');
					}else{
						tip.css('margin-top','-12px');
					}
				}
			}
      */
		},
		hideError:function(obj){
			$('#'+obj.attr('name')+'Tip').remove();
		}
	}

	Validate.defaultOption = {
		rule:[],
		message:{
			space:"输入值中有空格，非法字符",
			required: "这是必填字段",
			phone:'请正确填写您的联系电话',
			remote: "请修正此字段",
			email: "请输入有效的电子邮件地址",
			url: "请输入有效的网址",
			date: "请输入有效的日期",
			dateISO: "请输入有效的日期 (YYYY-MM-DD)",
			number: "请输入有效的数字",
			digits: "只能输入数字",
			creditcard: "请输入有效的信用卡号码",
			equalTo: "你的输入不相同",
			extension: "请输入有效的后缀",
			minlength: "输入最小长度为",
			maxlength: "输入最大长度为",
			number:'请输入数字',
			username:'非法字符,只能输入 中文、英文、数字及下划线',
			loginname:'非法字符,只能输入 英文、数字及下划线'
		}
	};
	$.fn.validate = function(option, param){

		var options = typeof option == 'object' && option;

		options = $.extend(true, {}, Validate.defaultOption, options);

		var validate = new Validate(this, options);

		return validate.init();
	};
})(jQuery);
