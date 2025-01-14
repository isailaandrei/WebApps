using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CharacterControllerNumber : MonoBehaviour {

	public int characterNumber;
	public GameObject chooseAvatar;

	public void AvatarSelected() {
		chooseAvatar.GetComponent<ChooseAvatarPanelController> ().characterNumber = characterNumber;
		chooseAvatar.GetComponent<ChooseAvatarPanelController> ().AvatarChosen (characterNumber);
	}
}
