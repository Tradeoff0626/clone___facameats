var mapSearchByAddess = function( map , targetId , geoInput , $name , $address){

    var $name_val = $name.val().trim();
    var $address_val = $address.val().trim();
  
    // 12글자를 넘어서면... 처리
    if($name_val.length > 12){
        $name_val = $name_val.slice( 0 , 12 ) + "...";
    }
    
  
    // 주소-좌표 변환 객체를 생성
    var geocoder = new kakao.maps.services.Geocoder();
  
    // 주소로 좌표를 검색
    geocoder.addressSearch( $address_val , function(result, status) {
  
        // 정상적으로 검색이 완료됐으면...
        if (status === kakao.maps.services.Status.OK) {
  
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
  
            // 좌표를 form hidden 값에 저장
            $(geoInput).val(
                result[0].x + ',' + result[0].y
            );
            
            // 마커이미지의 주소
            var imageSrc = '/static/images/icon_pointer.png';
            
            // 마커 이미지의 이미지 크기
            var imageSize = new kakao.maps.Size(40, 46); 
    
            // 마커 이미지를 생성합니다    
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
  
            // 결과값으로 받은 위치를 마커로 표시
            var marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage
            });
  
            // 인포윈도우로 장소에 대한 설명을 표시
            var infowindow = new kakao.maps.InfoWindow({
                content: 
                    '<div style="width:150px;text-align:center;padding:6px 2px;"> \
                        '+$name_val+' \
                    </div>'
            });
            infowindow.open(map, marker);
  
            // 지도의 중심을 결과값으로 받은 위치로 이동
            map.setCenter(coords);
  
            // 지도를 화면에 표시
            $(targetId).css( 'visibility' , 'visible' );
  
  
        }else{
            alert('데이터가 존재하지 않습니다. 다시 검색해주세요.');
            
            // 좌표 및 인풋 초기화
            $(geoInput).val('');
            $address.val('');
            $(targetId).css( 'visibility' , 'hidden' );
        }
    });   
  } 