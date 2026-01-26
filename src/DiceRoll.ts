class DiceRoll {
    public roll: number = 0;
    public altRoll: number = 0;
    public modifier: number = 0;
    public advantage: boolean = false;
    public disadvantage: boolean = false;

    get total() {
        return this.roll + this.modifier;
    }
}
